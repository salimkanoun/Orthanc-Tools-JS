var Users = require('../model/Users')

    createUser = async function (req, res) {
        const body = req.body
        try {
            await Users.createUser(body.username, body.firstname, body.lastname, body.email, body.password, body.role, body.super_admin)
            res.sendStatus(201)
        } catch (error) {
            console.error(error)
            res.status(400).json({errorMessage : error.message})
        }
    }

    getUsers = async function (req, res) {
        let user
        try {
            user = await Users.getUsers()
            res.json(user)
        } catch (error) {
            console.error(error)
            res.status(400).send({errorMessage : error.message})
        }
        
    }

    modifyUser = async function(req, res){
        const id = req.params.id
        const body = req.body
        try {
            await Users.modifyUser(id, body.username, body.firstname, body.lastname, body.password, body.email, body.role, body.superAdmin)
            res.sendStatus(200)
        } catch (error) {
            console.error(error)
            res.status(400).send({errorMessage : error.message})
        }
    }

    deleteUser = async function(req, res){
        const username = req.params.username
        try {
            await Users.deleteUser(username)
            res.sendStatus(200)
        } catch (error) {
            console.error(error)
            res.status(400).json({errorMessage : error.message})
        }
    }

module.exports = { createUser, modifyUser, deleteUser, getUsers }