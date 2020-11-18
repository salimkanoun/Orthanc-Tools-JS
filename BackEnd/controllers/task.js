const { remove } = require("jszip")
const AbstractTask = require("../model/AbstractTask")

const getTask = async (req, res) => {
    try {
        if (!req.params.id)
            throw "task id expect"
        if (!(req.params.id in AbstractTask.taskIndex))
            throw "invalid task id"

        res.json(await AbstractTask.taskIndex[req.params.id].getFormated())
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
            formatedTasks.push(tasks[i].getFormated())
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
        res.status(400).send(error)
    }
}

const getTaskWithUser = async (req, res) => {
    try {
        res.json(await AbstractTask.getTaskOfUser(req.params.username, req.params.type).getFormated())
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const getTasksOfType = async (req, res) => {
    try {
        res.json(await Promise.all(AbstractTask.getTasksOfType(req.params.type).map(x => x.getFormated())))
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


module.exports = { getTask, getTasks, getTasksIds, getTaskWithUser, getTasksOfType, deleteTask, deleteTaskOfUser }