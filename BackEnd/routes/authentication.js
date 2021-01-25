var express = require('express')
var routerAuthentication = express.Router()

const { login, logOut } = require('../controllers/authentication')

//Authentication APIs
routerAuthentication.post('/', login)
routerAuthentication.delete('/', logOut)

module.exports = routerAuthentication
