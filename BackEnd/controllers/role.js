var Roles = require('../model/Roles')

    createRole = async function (req, res) {
        const body = req.body
        try {
            await Roles.createRoles(body)
        } catch (error) {
            res.status(401).send('Fail')
        }
    }

    modifyRole = async function(req, res){
        const body = req.body
        try {
            await Roles.modifyRole(body.name, body)
        } catch (error) {
            res.status(401).send('Fail to modify role')
        }
    }

    deleteRole = async function(req, res){
        const name = req.body
        try {
            await Roles.deleteRole(name)
        } catch (error) {
            res.status(401).send('Fail to delete')
        }
    }

module.exports = { createRole, modifyRole, deleteRole }