const { remove } = require("jszip")
const AbstractTask = require("../model/AbstractTask")
const TaskType = AbstractTask.TaskType;
const AnonTask = require("../model/tasks/AnonTask")
const DeleteTask = require("../model/tasks/DeleteTask")
const RetrieveTask = require("../model/tasks/RetrieveTask")
const ExportTask = require("../model/tasks/ExportTask")
const Endpoint = require("../model/export/Endpoint")
const { OTJSNotFoundException } = require("../Exceptions/OTJSErrors")

/**
 * Creating anonymisation task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addAnonTask = async (req, res) => {
    let orthancIds = req.body
    let task = new AnonTask(req.params.username, orthancIds)
    task.run()
    res.json({ id: task.id })
}

/**
 * Creating deletion task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addDeleteTask = async (req, res) => {
    let orthancIds = req.body
    let task = new DeleteTask(req.params.username, orthancIds)
    task.run()
    res.json({ id: task.id })
}

/**
 * Creating retrieve task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addRetrieveTask = async (req, res) => {
    let answers = req.body.retrieveArray
    let task = new RetrieveTask(req.params.username, req.body.projectName, answers)
    res.json({ id: task.id })
}

/**
 * Creating export task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addExportTask = async function(req,res){
    let studies = req.body.Resources
    let task = new ExportTask(req.params.user, studies, await Endpoint.getFromId(req.body.endpoint))
    task.run()
    res.json({id:task.id})
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
    if (!(req.params.id in AbstractTask.taskIndex))
        throw OTJSNotFoundException("invalid task id");
    res.json(await AbstractTask.taskIndex[req.params.id].getSendable())
}

/**
 * Response with all the tasks
 * @param {*} req express request
 * @param {*} res request result
 */
const getTasks = async (req, res) => {    
    let tasks = AbstractTask.taskIndex.values()
    let formatedTasks = []
    for (let i = 0; i < tasks.length; i++) {
        formatedTasks.push(tasks[i].getSendable())
    }
    res.json(formatedTasks)
}

/**
 * Response with all the tasks ids
 * @param {*} req express request
 * @param {*} res request result
 */
const getTasksIds = async (req, res) => {
    res.json(Object.values(AbstractTask.taskIndex).map(x => x.id))
}

/**
 * Response with the task corresponding to the requested user and type 
 * @param {*} req express request
 * @param {*} res request result
 */
const getTaskWithUser = async (req, res) => {
    let task = await AbstractTask.getTaskOfUser(req.params.username, req.params.type)
    if(task !== null){
        res.json( await task.getSendable())
    }else {
        throw OTJSNotFoundException("No task of this type for this user");
    }
}

/**
 * Response with all the tasks corresponding to the requested type 
 * @param {*} req express request
 * @param {*} res request result
 */
const getTasksOfType = async (req, res) => {
    res.json(await Promise.all(AbstractTask.getTasksOfType(req.params.type).map(x=>x.getSendable())))
}

/**
 * Response with the task corresponding to the requested user and type 
 * @param {*} req express request
 * @param {*} res request result
 */
const deleteTaskOfUser = async (req, res) => {
    let task = AbstractTask.getTaskOfUser(req.params.username, req.params.type)
    if(task === null) throw OTJSNotFoundException("No task of this type for this user");
    task.delete()
    AbstractTask.taskTypeUserIndex[req.params.type][req.params.username] = null;
    AbstractTask.taskIndex[task.id] = null 
    res.send('done')
}

/**
 * Response with the task corresponding to the requested id
 * @param {*} req express request
 * @param {*} res request result
 */
const deleteTask = async (req, res) => {
    let task =  AbstractTask.taskIndex[req.params.id]
    if(task === null) throw OTJSNotFoundException("No task with this id");
    await task.delete()
    delete task
    res.send('done')
}


module.exports = { getTask, getTasks, getTasksIds, getTaskWithUser, getTasksOfType, deleteTask, deleteTaskOfUser, addAnonTask, addDeleteTask, addRetrieveTask, addExportTask, validateRetrieve, deleteRetrieveItem }