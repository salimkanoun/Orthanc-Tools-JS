
const { taskIndex } = require("../model/AbstractTask")
const AbstractTask = require("../model/AbstractTask")

const getTaskProgress = async(req,res)=>{
    
    try {
        if(!req.params.id)
            throw "task id expect"
        if(!(req.params.id in AbstractTask.taskIndex))
            throw "invalid task id"
        
            res.json(await AbstractTask.taskIndex[req.params.id].getProgress())
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const getTaskStatus = async(req,res)=>{
    try {
        if(!req.params.id)
            throw "task id expect"
        if(!(req.params.id in AbstractTask.taskIndex))
            throw "invalid task id"
        
        res.json(await AbstractTask.taskIndex[req.params.id].getState())
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

module.exports = {getTaskProgress,getTaskStatus}