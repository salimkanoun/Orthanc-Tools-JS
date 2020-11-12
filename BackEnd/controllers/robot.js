const AnonTask = require("../model/tasks/AnonTask")
const DeleteTask = require("../model/tasks/DeleteTask")

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

module.exports = { addAnonTask, addDeleteTask }