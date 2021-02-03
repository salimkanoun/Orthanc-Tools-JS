const { remove } = require("jszip")
const AbstractTask = require("../model/AbstractTask")
const TaskType = AbstractTask.TaskType;
const AnonTask = require("../model/tasks/AnonTask")
const DeleteTask = require("../model/tasks/DeleteTask")
const RetrieveTask = require("../model/tasks/RetrieveTask")
const OrthancQueue = require("../model/OrthancQueue");
const ExportTask = require("../model/tasks/ExportTask");
const { OTJSNotFoundException } = require("../Exceptions/OTJSErrors");

let orthancQueue = new OrthancQueue();

/**
 * Creating anonymisation task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addAnonTask = async (req, res) => {
    let orthancIds = req.body
    if (AbstractTask.getTaskOfUser(req.params.username, TaskType.ANONYMIZE)) {
        console.error('Task already in progress')
        res.status(403).send('Task already in progress')
        return;
    }
    res.json({id:orthancQueue.anonimizeItems(req.roles.username, orthancIds)});
}

/**
 * Creating deletion task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addDeleteTask = async (req, res) => {
    let orthancIds = req.body
    if (AbstractTask.getTaskOfUser(req.params.username, TaskType.DELETE)) {
        console.error('Task already in progress')
        res.status(403).send('Task already in progress')
        return;
    }
    let id = orthancQueue.deleteItems(req.roles.username, orthancIds);
    res.json({ id })
}

/**
 * Creating retrieve task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addRetrieveTask = async (req, res) => {
    let answers = req.body.retrieveArray
    if (AbstractTask.getTaskOfUser(req.params.username, TaskType.RETRIEVE)) {
        console.error('Task already in progress')
        res.status(403).send('Task already in progress')
        return;
    }
    let task = new RetrieveTask(req.params.username, req.body.projectName, answers)
    res.json({ id: task.id })
}

/**
 * Creating export task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addExportTask = async function(req,res){
    let studies = req.body.Resources;
    let endpoint = req.body.endpoint;
    let id = orthancQueue.exportToEndpoint(req.roles.username,studies, null, endpoint);
    res.json({id})
}

/**
 * Validate the retrieve task based on the username
 * @param {*} req express request
 * @param {*} res request result
 */
const validateRetrieve = async (req, res) => {
    let task = AbstractTask.getTaskOfUser(req.params.username, TaskType.RETRIEVE)
    task.run();
    res.json(true)
}

/**
 * Remove an item from the retrieve task
 * @param {*} req express request
 * @param {*} res request result
 */
const deleteRetrieveItem = async (req, res) => {
    let task = AbstractTask.getTaskOfUser(req.params.username, TaskType.RETRIEVE)
    task.deleteItem(req.params.id)
    res.json(true)
}

/**
 * Response with the task corresponding to the requested id 
 * @param {*} req express request
 * @param {*} res request result
 */
const getTask = async (req, res) => {
    try {
        if (!req.params.id)
            throw "task id expect"
        //if (!(req.params.id in AbstractTask.taskIndex))
        //    throw "invalid task id"
        if(AbstractTask.taskIndex[req.params.id]){
            res.json(await AbstractTask.taskIndex[req.params.id].getSendable())
        }else{
            let task = null;
            switch(req.params.id[0]){
                case 'a' :
                    task = await AnonTask.getTask(req.params.id);
                    break;
                case 'e' :
                    task = await ExportTask.getTask(req.params.id);
                    break;
                case 'd' : 
                    task = await DeleteTask.getDeleteTask(req.params.id);
            }
            if(task === null) {
                throw OTJSNotFoundException("Unknown task");
            } 
            res.json(task);
        }
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

/**
 * Response with all the tasks
 * @param {*} req express request
 * @param {*} res request result
 */
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

/**
 * Response with all the tasks ids
 * @param {*} req express request
 * @param {*} res request result
 */
const getTasksIds = async (req, res) => {
    try {
        res.json(Object.values(AbstractTask.taskIndex).map(x => x.id))
    } catch (error) {
        console.error(error)
        res.status(400).json([])
    }
}

/**
 * Response with the task corresponding to the requested user and type 
 * @param {*} req express request
 * @param {*} res request result
 */
const getTaskWithUser = async (req, res) => {
    try {
        let task = await AbstractTask.getTaskOfUser(req.params.username, req.params.type)
        if(task !== null){
            res.json( await task.getSendable())
        }else {
            res.status(404).send()
        }
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}

/**
 * Response with all the tasks corresponding to the requested type 
 * @param {*} req express request
 * @param {*} res request result
 */
const getTasksOfType = async (req, res) => {
    try {
        res.json(await Promise.all(AbstractTask.getTasksOfType(req.params.type).map(x=>x.getSendable()) ))
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

/**
 * Response with the task corresponding to the requested user and type 
 * @param {*} req express request
 * @param {*} res request result
 */
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

/**
 * Response with the task corresponding to the requested id
 * @param {*} req express request
 * @param {*} res request result
 */
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