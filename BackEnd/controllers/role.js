var Roles = require('../model/Roles')

    createRole = async function (req, res) {
        const body = req.body
        try {
            await Roles.createRoles(body)
            res.json(true)
        } catch (error) {
            console.log(error)
            res.status(401).send('Fail')
        }
    }

    modifyRole = async function(req, res){
        const body = req.body
        try {
            await Roles.modifyRoles(body.name, body)
            res.json(true)
        } catch (error) {
            console.log(error)
            res.status(401).send('Fail to modify role')
        }
    }

    deleteRole = async function(req, res){
        const name = req.body
        try {
            await Roles.deleteRole(name)
            res.json(true)
        } catch (error) {
            console.log(error)
            res.status(401).send('Fail to delete')
        }
    }

    getRoles = async function(req, res){
        try {
            let roles = await Roles.getAllRoles()
            res.json(roles)
        } catch (error) {
            res.json('')
            console.log(error)
        }
    }

    getPermission = async function(req, res){
        try {
            let permission = await Roles.getPermission(req.params.name)
            res.json(permission)
        } catch (error) {
            console.log(error)
            res.status(401).send('Fail to get Permission')
        }
    }

module.exports = { createRole, modifyRole, deleteRole, getRoles, getPermission }