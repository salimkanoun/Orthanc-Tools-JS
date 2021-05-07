var Roles = require('../model/Roles')

const createRole = async function (req, res) {
    const body = req.body
    await Roles.createRoles(body)
    res.sendStatus(201)
}

const modifyRole = async function (req, res) {
    const body = req.body
    await Roles.modifyRoles(body.name, body)
    res.sendStatus(200)
}

const deleteRole = async function (req, res) {
    const body = req.body
    await Roles.deleteRole(body.name)
    res.sendStatus(200)
}

const getRoles = async function (req, res) {
    let roles = await Roles.getAllRoles()
    res.json(roles)
}

const getPermission = async function (req, res) {
    let permission = await Roles.getPermission(req.params.name)
    res.json(permission)
}

module.exports = { createRole, modifyRole, deleteRole, getRoles, getPermission }