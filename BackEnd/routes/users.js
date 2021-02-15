var express = require('express')
var userRouter = express.Router()

const { getUsers, createUser, modifyUser, deleteUser } = require('../controllers/user')
const { userAdminMidelware, userAuthMidelware } = require('../midelwares/authentication')

userRouter.get('/', [userAuthMidelware, userAdminMidelware], userAdminMidelware ,getUsers)
userRouter.post('/', [userAuthMidelware, userAdminMidelware], userAdminMidelware ,createUser)
userRouter.put('/:username', [userAuthMidelware, userAdminMidelware], userAdminMidelware ,modifyUser)
userRouter.delete('/:username', [userAuthMidelware, userAdminMidelware], userAdminMidelware, deleteUser)

module.exports = userRouter
