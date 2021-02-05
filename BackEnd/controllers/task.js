const Task = require("../model/Task");
const AnonTask = require("../model/tasks/AnonTask");
const DeleteTask = require("../model/tasks/DeleteTask");
const RetrieveTask = require("../model/tasks/RetrieveTask");
const ExportTask = require("../model/tasks/ExportTask");


/**
 * Creating anonymisation task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addAnonTask = async (req, res) => {
    let orthancIds = req.body;
    res.json({id:await AnonTask.createTask(req.roles.username, orthancIds)});
}

/**
 * Creating deletion task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addDeleteTask = async (req, res) => {
    let orthancIds = req.body;
    let id = await DeleteTask.createTask(req.roles.username, orthancIds);
    res.json({ id })
}

/**
 * Creating retrieve task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addRetrieveTask = async (req, res) => {
    let answers = req.body.retrieveArray
    let id = await RetrieveTask.createTask(req.roles.username, req.body.projectName, answers);
    res.json({ id })
}

/**
 * Creating export task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addExportTask = async function(req,res){
    let studies = req.body.Resources;
    let endpoint = req.body.endpoint;
    let transcoding = req.body.transcoding;
    let id = await  ExportTask.createTask(req.roles.username, studies, endpoint, transcoding);
    res.json({id});
}

/**
 * Validate the retrieve task based on the username
 * @param {*} req express request
 * @param {*} res request result
 */
const validateRetrieve = async (req, res) => {
    await RetrieveTask.validateTask(req.roles.username);
    res.json(true);
}

/**
 * Remove an item from the retrieve task
 * @param {*} req express request
 * @param {*} res request result
 */
const deleteRetrieveItem = async (req, res) => {
    let task = await RetrieveTask.getUserTask(req.roles.username);
    await RetrieveTask.deleteItem(task.id, req.params.id);
    res.json(true)
}

/**
 * Response with the task corresponding to the requested id 
 * @param {*} req express request
 * @param {*} res request result
 */
const getTasks = async (req, res) => {
    res.json(await Task.getTasks());
}

/**
 * Response with all the tasks ids
 * @param {*} req express request
 * @param {*} res request result
 */
const getTasksIds = async (req, res) => {
    let tasks = await Task.getTasks();
    res.json(tasks.map(task => task.id));
}

/**
 * Response with the task corresponding to the requested user and type 
 * @param {*} req express request
 * @param {*} res request result
 */
const getTaskWithUser = async (req, res) => {
    res.json(await Task.getUserTask(req.params.username, req.params.type));
}

/**
 * Response with all the tasks corresponding to the requested type 
 * @param {*} req express request
 * @param {*} res request result
 */
const getTasksOfType = async (req, res) => {
    res.json(await Task.getTasksOfType(req.params.type));
}

/**
 * Response with the task corresponding to the requested user and type 
 * @param {*} req express request
 * @param {*} res request result
 */
const deleteTaskOfUser = async (req, res) => {
    await Task.deleteTaskOfUser(req.params.username, req.params.type);
    res.json(true);
}

/**
 * Response with the task corresponding to the requested id
 * @param {*} req express request
 * @param {*} res request result
 */
const deleteTask = async (req, res) => {
    await Task.deleteTask(req.params.id);
    res.json(true);
}


module.exports = { getTask, getTasks, getTasksIds, getTaskWithUser, getTasksOfType, deleteTask, deleteTaskOfUser, addAnonTask, addDeleteTask, addRetrieveTask, addExportTask, validateRetrieve, deleteRetrieveItem }