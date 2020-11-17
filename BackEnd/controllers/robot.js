const AnonTask = require("../model/tasks/AnonTask")
const DeleteTask = require("../model/tasks/DeleteTask")
const RetrieveTask = require("../model/tasks/RetrieveTask")

const addAnonTask = async function (req, res) {
    let orthancIds = req.body
    let task = new AnonTask(req.params.user,orthancIds)
    task.run()
    res.json({ id: task.id })
}

const addDeleteTask = async function (req, res) {
    let orthancIds = req.body
    let task = new DeleteTask(req.params.user, orthancIds)
    task.run()
    res.json({ id: task.id })
}

const addRetrieveTask = async function (req, res) {
    let answers = req.body.retrieveArray
    let task = new RetrieveTask(req.params.user, req.body.projectName, answers)
    task.run()
    res.json({ id: task.id })
}

module.exports = { addAnonTask, addDeleteTask, addRetrieveTask }