const AbstractTask = require("../model/AbstractTask")
const TaskType = AbstractTask.TaskType;
const AnonTask = require("../model/tasks/AnonTask")
const DeleteTask = require("../model/tasks/DeleteTask")
const RetrieveTask = require("../model/tasks/RetrieveTask")
const OrthancQueue = require("../model/OrthancQueue");
const ExportTask = require("../model/tasks/ExportTask");
const { OTJSNotFoundException, OTJSBadRequestException, OTJSForbiddenException } = require("../Exceptions/OTJSErrors");

let orthancQueue = new OrthancQueue();

/**
 * Creating anonymisation task based on the request
 * @param {*} req express request
 * @param {*} res request result
 */
const addAnonTask = async (req, res) => {
    let orthancIds = req.body
    let task = await AnonTask.getUserTask(req.roles.username);
    if(!!task){
        if(['completed','failed'].includes(task.state)){
            AnonTask.delete(task.id);
        }
        else{
            throw new OTJSForbiddenException("Cant create two anonymiztion simulteanously");
        }
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
    let task = await DeleteTask.getUserTask(req.roles.username);
    if(!!task){
        if(['completed','failed'].includes(task.state)){
            DeleteTask.delete(task.id);
        }
        else{
            throw new OTJSForbiddenException("Cant create two deletion simulteanously");
        }
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
    let task = await RetrieveTask.getUserTask(req.roles.username);
    if(!!task){
        if(['completed','failed'].includes(task.state)){
            RetrieveTask.delete(task.id);
        }
        else{
            throw new OTJSForbiddenException("Cant create two retrieval simulteanously");
        }
    }
    let id = orthancQueue.validateItems(req.roles.username, req.body.projectName, answers)
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
    let id = orthancQueue.exportToEndpoint(req.roles.username,studies, null, endpoint);
    res.json({id})
}

/**
 * Validate the retrieve task based on the username
 * @param {*} req express request
 * @param {*} res request result
 */
const validateRetrieve = async (req, res) => {
    let task = await RetrieveTask.getUserTask(req.roles.username);
    orthancQueue.approveTask(task.id);
    res.json(true)
}

/**
 * Remove an item from the retrieve task
 * @param {*} req express request
 * @param {*} res request result
 */
const deleteRetrieveItem = async (req, res) => {
    let task = await RetrieveTask.getUserTask(req.roles.username);
    RetrieveTask.deleteItem(task.id, req.params.id);
    res.json(true)
}

/**
 * Response with the task corresponding to the requested id 
 * @param {*} req express request
 * @param {*} res request result
 */
const getTask = async (req, res) => {
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
                task = await DeleteTask.getTask(req.params.id);
                break;
            case 'r' : 
                task = await RetrieveTask.getTask(req.params.id);
                break;
        }
        if(task === null) {
            throw new OTJSNotFoundException("Unknown task");
        } 
        res.json(task);
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
    let task;
    switch (req.params.type) {
        case 'retrieve':
            task = await RetrieveTask.getUserTask(req.roles.username);
            break;
        case 'export':
            task = await ExportTask.getUserTask(req.roles.username);
            break;
        case 'anonymize':
            task = await AnonTask.getUserTask(req.roles.username);
            break;
        case 'delete':
            task = await DeleteTask.getUserTask(req.roles.username);
            break;
        default:
            throw new OTJSBadRequestException('Unknown type of task');
    }


    if(task===null) throw new OTJSNotFoundException("Unknown task");
    
    res.json(task);
}

/**
 * Response with all the tasks corresponding to the requested type 
 * @param {*} req express request
 * @param {*} res request result
 */
const getTasksOfType = async (req, res) => {
    let tasks;
    switch (req.params.type) {
        case 'retrieve':
            tasks = await RetrieveTask.getTasks();
            break;
        case 'export':
            tasks = await ExportTask.getTasks();
            break;
        case 'anonymize':
            tasks = await AnonTask.getTasks();
            break;
        case 'delete':
            tasks = await DeleteTask.getTasks();
            break;
        default:
            throw new OTJSBadRequestException('Unknown type of task');
    }

    res.json(tasks);
}

/**
 * Response with the task corresponding to the requested user and type 
 * @param {*} req express request
 * @param {*} res request result
 */
const deleteTaskOfUser = async (req, res) => {
    let task;
    switch (req.params.type) {
        case 'retrieve':
            task = await RetrieveTask.getUserTask(req.roles.username);
            RetrieveTask.delete(task.id);
            break;
        case 'delete':
            task = await DeleteTask.getUserTask(req.roles.username);
            DeleteTask.delete(task.id);
            break;
        case 'anonymize':
            task = await AnonTask.getUserTask(req.roles.username);
            AnonTask.delete(task.id);
            break;
        default:
            throw new OTJSBadRequestException('Cant delete this task');
    }
    res.json(true);
}

/**
 * Response with the task corresponding to the requested id
 * @param {*} req express request
 * @param {*} res request result
 */
const deleteTask = async (req, res) => {
    let task = null;
    switch(req.params.id[0]){
        case 'r' : 
            task = await RetrieveTask.delete(req.params.id);
            break;
        case 'a' : 
            task = await AnonTask.delete(req.params.id);
            break;
        case 'd' : 
            task = await DeleteTask.delete(req.params.id);
            break;
        default:
            throw new OTJSBadRequestException('Cant delete this task');
    }
    res.json(true);
}


module.exports = { getTask, getTasks, getTasksIds, getTaskWithUser, getTasksOfType, deleteTask, deleteTaskOfUser, addAnonTask, addDeleteTask, addRetrieveTask, addExportTask, validateRetrieve, deleteRetrieveItem }