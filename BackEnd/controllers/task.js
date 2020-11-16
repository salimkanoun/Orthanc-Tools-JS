
const { taskIndex } = require("../model/AbstractTask")
const AbstractTask = require("../model/AbstractTask")

const getTask = async(req, res)=>{
    try {
        if(!req.params.id)
            throw "task id expect"
        if(!(req.params.id in AbstractTask.taskIndex))
            throw "invalid task id"
        
        res.json(await AbstractTask.taskIndex[req.params.id].getFormated())
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const getTasks = async(req, res)=>{
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

const getTasksIds = async(req, res)=>{
    try {
        res.json(Object.values(AbstractTask.taskIndex).map(x=>x.id))
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const getTaskWithUser = async(req, res)=>{
    try {
        res.json(await AbstractTask.taskTypeUserIndex[req.params.type][req.params.user].getFormated())
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

module.exports = {getTask, getTasks, getTasksIds, getTaskWithUser}