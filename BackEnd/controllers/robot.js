const AbstractTask = require("../model/AbstractTask")
const TaskType = AbstractTask.TaskType;
const AnonTask = require("../model/tasks/AnonTask")
const DeleteTask = require("../model/tasks/DeleteTask")
const RetrieveTask = require("../model/tasks/RetrieveTask")

const addAnonTask = async function (req, res) {
    let orthancIds = req.body
    if(AbstractTask.getExistingTask(req.params.user,TaskType.ANONYMIZE)){
        console.error('Task already in progress')
        res.status(401).send('Task already in progress')
        return;
    } 
    let task = new AnonTask(req.params.user,orthancIds)
    task.run()
    res.json({ id: task.id })
}

const addDeleteTask = async function (req, res) {
    let orthancIds = req.body
    if(AbstractTask.getExistingTask(req.params.user,TaskType.DELETE)){
        console.error('Task already in progress')
        res.status(401).send('Task already in progress')
        return;
    } 
    let task = new DeleteTask(req.params.user, orthancIds)
    task.run()
    res.json({ id: task.id })
}

const addRetrieveTask = async function (req, res) {
    let answers = req.body.retrieveArray
    if(AbstractTask.getExistingTask(req.params.user,TaskType.RETRIEVE)){
        console.error('Task already in progress')
        res.status(401).send('Task already in progress')
        return;
    }    
    let task = new RetrieveTask(req.params.user, req.body.projectName, answers)
    task.run()
    res.json({ id: task.id })
}

module.exports = { addAnonTask, addDeleteTask, addRetrieveTask }