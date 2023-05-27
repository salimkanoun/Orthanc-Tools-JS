const RoleEntity = require('../model/Entities/RoleEntity')
const Roles = require('../model/Roles')

const createRole = async function (req, res) {
    const body = req.body
    await Roles.createRoles(body)
    res.sendStatus(201)
}

const modifyRole = async function (req, res) {
    const body = req.body
    await Roles.modifyRoles(req.params.name, body)
    res.sendStatus(200)
}

const deleteRole = async function (req, res) {
    await Roles.deleteRole(req.params.name)
    res.sendStatus(200)
}

const getRoles = async function (req, res) {
    let roles = await Roles.getAllRoles()
    let formattedRoles = roles.map(role => RoleEntity.createRolefromDB(role))
    res.json(formattedRoles)
}

const getRole = async function (req, res) {
    let role = await Roles.getRole(req.params.name)
    res.json(RoleEntity.createRolefromDB(role))
}

module.exports = { createRole, modifyRole, deleteRole, getRoles, getRole }