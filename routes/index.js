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
var robotController = require('../controllers/createRobot')
var optionsController = require('../controllers/options')

// Route request to controllers
router.all('/', authenticationController.getResults)

router.all('/autoQuery', autoQueryController.getResults)

router.all('/query', queryController.getResults)

router.all('/job_details', jobDetailsController.getResults)

router.all('/retrieve', retrieveController.getResults)

router.all('/export_dicom', exportController.getResults)

router.all('/create_robot', robotController.getResults)

router.all('/options', optionsController.getResults)

module.exports = router
