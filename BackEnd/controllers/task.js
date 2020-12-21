const { remove } = require("jszip")
const AbstractTask = require("../model/AbstractTask")
const TaskType = AbstractTask.TaskType;
const AnonTask = require("../model/tasks/AnonTask")
const DeleteTask = require("../model/tasks/DeleteTask")
const RetrieveTask = require("../model/tasks/RetrieveTask")
const ExportTask = require("../model/tasks/ExportTask")
const Endpoint = require("../model/export/Endpoint")


const addAnonTask = async (req, res) => {
    let orthancIds = req.body
    if (AbstractTask.getTaskOfUser(req.params.username, TaskType.ANONYMIZE)) {
        console.error('Task already in progress')
        res.status(401).send('Task already in progress')
        return;
    }
    let task = new AnonTask(req.params.username, orthancIds)
    task.run()
    res.json({ id: task.id })
}

const addDeleteTask = async (req, res) => {
    let orthancIds = req.body
    if (AbstractTask.getTaskOfUser(req.params.username, TaskType.DELETE)) {
        console.error('Task already in progress')
        res.status(401).send('Task already in progress')
        return;
    }
    let task = new DeleteTask(req.params.username, orthancIds)
    task.run()
    res.json({ id: task.id })
}

const addRetrieveTask = async (req, res) => {
    let answers = req.body.retrieveArray
    if (AbstractTask.getTaskOfUser(req.params.username, TaskType.RETRIEVE)) {
        console.error('Task already in progress')
        res.status(401).send('Task already in progress')
        return;
    }
    let task = new RetrieveTask(req.params.username, req.body.projectName, answers)
    res.json({ id: task.id })
}

const addExportTask = async function(req,res){
    let studies = req.body.Resources
    let task = new ExportTask(req.params.user, studies, await Endpoint.getFromId(req.body.endpoint))
    task.run()
    res.json({id:task.id})
}

const validateRetrieve = async (req, res) => {
    let task = AbstractTask.getTaskOfUser(req.params.username, TaskType.RETRIEVE)
    task.run();
    res.json(true)
}

const deleteRetrieveItem = async (req, res) => {
    let task = AbstractTask.getTaskOfUser(req.params.username, TaskType.RETRIEVE)
    task.deleteItem(req.params.id)
    res.json(true)
}

const getTask = async (req, res) => {
    try {
        if (!req.params.id)
            throw "task id expect"
        if (!(req.params.id in AbstractTask.taskIndex))
            throw "invalid task id"

        res.json(await AbstractTask.taskIndex[req.params.id].getSendable())
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const getTasks = async (req, res) => {
    try {
        let tasks = AbstractTask.taskIndex.values()
        let formatedTasks = []
        for (let i = 0; i < tasks.length; i++) {
            formatedTasks.push(tasks[i].getSendable())
        }
        res.json(formatedTasks)
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const getTasksIds = async (req, res) => {
    try {
        res.json(Object.values(AbstractTask.taskIndex).map(x => x.id))
    } catch (error) {
        console.error(error)
        res.status(400).json([])
    }
}

const getTaskWithUser = async (req, res) => {
    try {
        let task = await AbstractTask.getTaskOfUser(req.params.username, req.params.type).getSendable()
        if(task !== null){
            console.log(task)
            res.json(task)
        }else {
            res.status(404).send()
        }
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}

const getTasksOfType = async (req, res) => {
    try {
        res.json(await Promise.all(AbstractTask.getTasksOfType(req.params.type).map(x=>x.getSendable()) ))
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const deleteTaskOfUser = async (req, res) => {
    try {
        let task = AbstractTask.getTaskOfUser(req.params.username, req.params.type)
        task.delete()
        AbstractTask.taskTypeUserIndex[req.params.type][req.params.username] = null;
        AbstractTask.taskIndex[task.id] = null 
        res.send('done')
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const deleteTask = async (req, res) => {
    try {
        let task =  AbstractTask.taskIndex[req.params.id]
        await task.delete()
        delete task
        res.send('done')
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}


module.exports = { getTask, getTasks, getTasksIds, getTaskWithUser, getTasksOfType, deleteTask, deleteTaskOfUser, addAnonTask, addDeleteTask, addRetrieveTask, addExportTask, validateRetrieve, deleteRetrieveItem }