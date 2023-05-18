var express = require('express')
var routerAuthentication = express.Router()

const { login } = require('../controllers/authentication')

//Authentication APIs
routerAuthentication.post('/', login)

module.exports = routerAuthentication
