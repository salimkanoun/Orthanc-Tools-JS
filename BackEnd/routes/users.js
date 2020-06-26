var express = require('express')
var router = express.Router()

const { getUsers, createUser, modifyUser, deleteUser } = require('../controllers/user')

const { userAdminMidelware } = require('../midelwares/authentication')

/* GET users listing. */
router.get('/users', userAdminMidelware ,getUsers)
router.post('/users', userAdminMidelware ,createUser)
router.put('/users', userAdminMidelware ,modifyUser)
router.delete('/users', userAdminMidelware, deleteUser)

module.exports = router
