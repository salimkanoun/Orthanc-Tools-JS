var RoleLabel = require('../model/RoleLabel')

const createRoleLabel = async function (req, res) {
    await RoleLabel.createRoleLabel(req.body.role_name, req.params.name)
    res.sendStatus(201)
}

const deleteRoleLabel = async function (req, res) {
    await RoleLabel.deleteRoleLabel(req.body.role_name, req.params.name)
    res.sendStatus(200)
}

const getAllRolesLabels= async function (req, res) {
    let roleslabels = await RoleLabel.getAll()
    res.json(roleslabels)
}

const getRoleLabels = async function (req, res) {
    let roleslabels = await RoleLabel.getLabelsFromRoleName(req.params.role_name)
    res.json(roleslabels)
}
const getLabelRoles = async function (req, res) {
    let labelsroles = await RoleLabel.getRolesFromLabel(req.params.label);
    res.json(labelsroles)
}

module.exports = {createRoleLabel, deleteRoleLabel, getAllRolesLabels, getLabelRoles, getRoleLabels}