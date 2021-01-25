var express = require('express')
var userRouter = express.Router()

const { getUsers, createUser, modifyUser, deleteUser } = require('../controllers/user')
const { userAdminMidelware, userAuthMidelware } = require('../midelwares/authentication')

userRouter.use([userAuthMidelware, userAdminMidelware])

userRouter.get('/', userAdminMidelware ,getUsers)
userRouter.post('/', userAdminMidelware ,createUser)
userRouter.put('/', userAdminMidelware ,modifyUser)
userRouter.delete('/', userAdminMidelware, deleteUser)

module.exports = userRouter
