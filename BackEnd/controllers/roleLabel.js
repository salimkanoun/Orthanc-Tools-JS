var RoleLabel = require('../model/RoleLabel')

/**
 * Create a RoleLabel
 * @param {*} req express request
 * @param {*} res request result
 */
const createRoleLabel = async function (req, res) {
    await RoleLabel.createRoleLabel(req.body.role_name, req.params.name)
    res.sendStatus(201)
}

/**
 * Delete a RoleLabel
 * @param {*} req express request
 * @param {*} res request result
 */
const deleteRoleLabel = async function (req, res) {
    await RoleLabel.deleteRoleLabel(req.body.role_name, req.params.name)
    res.sendStatus(200)
}

/**
 * Get all RoleLabels
 * @param {*} req express request
 * @param {*} res request result
 */
const getAllRolesLabels= async function (req, res) {
    let roleslabels = await RoleLabel.getAll()
    res.json(roleslabels)
}

/**
 * Get RoleLabels using a Role name
 * @param {*} req express request
 * @param {*} res request result
 */
const getRoleLabels = async function (req, res) {
    let roleslabels = await RoleLabel.getLabelsFromRoleName(req.params.role_name)
    res.json(roleslabels)
}

/**
 * Get RoleLabels using a Label name
 * @param {*} req express request
 * @param {*} res request result
 */
const getLabelRoles = async function (req, res) {
    let labelsroles = await RoleLabel.getRolesFromLabel(req.params.label);
    res.json(labelsroles)
}

module.exports = {createRoleLabel, deleteRoleLabel, getAllRolesLabels, getLabelRoles, getRoleLabels}