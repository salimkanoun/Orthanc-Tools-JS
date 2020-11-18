const AbstractTask = require("../model/AbstractTask")
const TaskType = AbstractTask.TaskType;
const AnonTask = require("../model/tasks/AnonTask")
const DeleteTask = require("../model/tasks/DeleteTask")
const RetrieveTask = require("../model/tasks/RetrieveTask")

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

module.exports = { addAnonTask, addDeleteTask, addRetrieveTask, validateRetrieve, deleteRetrieveItem}