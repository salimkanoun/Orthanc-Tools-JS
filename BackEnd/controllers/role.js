var Roles = require('../model/Roles')

    const createRole = async function (req, res) {
        const body = req.body
        try {
            await Roles.createRoles(body)
            res.json(true)
        } catch (error) {
            console.error(error)
            res.status(500).send('Fail')
        }
    }

    const modifyRole = async function(req, res){
        const body = req.body
        try {
            await Roles.modifyRoles(body.name, body)
            res.json(true)
        } catch (error) {
            console.error(error)
            res.status(500).send('Fail to modify role')
        }
    }

    const deleteRole = async function(req, res){
        const name = req.body
        try {
            await Roles.deleteRole(name)
            res.json(true)
        } catch (error) {
            console.error(error)
            res.status(500).send('Fail to delete')
        }
    }

    const getRoles = async function(req, res){
        try {
            let roles = await Roles.getAllRoles()
            res.json(roles)
        } catch (error) {
            res.json('')
            console.error(error)
        }
    }

    const getPermission = async function(req, res){
        try {
            let permission = await Roles.getPermission(req.params.name)
            res.json(permission)
        } catch (error) {
            console.error(error)
            res.status(500).send('Fail to get Permission')
        }
    }

module.exports = { createRole, modifyRole, deleteRole, getRoles, getPermission }