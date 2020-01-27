var express = require('express')
var router = express.Router()

// Handle controller errors
require('express-async-errors')

var authenticationController = require('../controllers/authentication')
var autoQueryController = require('../controllers/autoQuery')
var queryController = require('../controllers/queryAction')
var jobDetailsController = require('../controllers/jobDetails')
var retrieveController = require('../controllers/retrieveDicom')
var exportController = require('../controllers/exportDicom')
var robotController = require('../controllers/Robot')
var optionsController = require('../controllers/options')
var aetsController = require('../controllers/aets')

const authUser = require('./auth_middelware')

// Route request to controllers
router.all('/authentication', authenticationController.getResults)

router.all('/autoQuery', authUser, autoQueryController.getResults)

router.all('/query', authUser, queryController.getResults)

router.all('/job_details', authUser, jobDetailsController.getResults)

router.all('/retrieve', authUser, retrieveController.getResults)

router.all('/export_dicom', authUser, exportController.getResults)

router.all('/robot', authUser, robotController.getResults)

router.all('/options', authUser, optionsController.getResults)

router.all('/aets', aetsController.getResults)

module.exports = router
