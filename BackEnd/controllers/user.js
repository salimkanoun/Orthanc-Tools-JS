const { OTJSBadRequestException } = require('../Exceptions/OTJSErrors')

var Users = require('../model/Users')

    createUser = async function (req, res) {
        const body = req.body
        if( !body.username || !body.password || !body.role){
            throw new OTJSBadRequestException('Username, Password and Role must be specified')
        }
        await Users.createUser(body.username, body.firstname, body.lastname, body.email, body.password, body.role, body.super_admin)
        res.sendStatus(201)
    }

    getUsers = async function (req, res) {
        let user = await Users.getUsers()
        res.json(user)
    }

    modifyUser = async function(req, res){
        const username = req.params.username
        const body = req.body
        await Users.modifyUser(username, body.firstname, body.lastname, body.password, body.email, body.role, body.superAdmin)
        res.sendStatus(200)
    }

    deleteUser = async function(req, res){
        const username = req.params.username
        await Users.deleteUser(username)
        res.sendStatus(200)
    }

module.exports = { createUser, modifyUser, deleteUser, getUsers }