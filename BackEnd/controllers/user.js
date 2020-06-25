var Users = require('../model/Users')

    createUser = async function (req, res) {
        const body = req.body
        try {
            await Users.createUser(body)
            res.json(true)
        } catch (error) {
            console.log(error)
            res.status(401).send('Fail to create user')
        }
    }

    getUsers = async function (req, res) {
        let user
        try {
            user = await Users.getUsers()
        } catch (error) {
            console.log(error)
            res.status(401).send('fail to get users')
        }
        res.json(user)
    }

    modifyUser = async function(req, res){
        const body = req.body
        try {
            await Users.modifyUser(body)
            res.json(true)
        } catch (error) {
            res.status(401).send('Fail to modify user')
        }
    }

    deleteUser = async function(req, res){
        const name = req.body
        try {
            await Users.deleteUser(name)
            res.json(true)
        } catch (error) {
            res.status(401).send('Fail to user')
        }
    }

module.exports = { createUser, modifyUser, deleteUser, getUsers }