var Users = require('../model/Users')

    createUser = async function (req, res) {
        const body = req.body
        try {
            await Users.createUser(body)
        } catch (error) {
            res.status(401).send('Fail')
        }
    }

    modifyUser = async function(req, res){
        const body = req.body
        try {
            await Users.modifyUser(body.name, body)
        } catch (error) {
            res.status(401).send('Fail to modify user')
        }
    }

    deleteUser = async function(req, res){
        const name = req.body
        try {
            await Users.deleteUser(name)
        } catch (error) {
            res.status(401).send('Fail to user')
        }
    }

module.exports = { createUser, modifyUser, deleteUser }