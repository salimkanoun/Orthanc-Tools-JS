var express = require('express')
var router = express.Router()

const { getRobotDetails, createRobot, deleteRobotJob, removeQueryFromJob } = require('../controllers/Robot')
const { changeSchedule , getSchedule } = require('../controllers/options')

// Handle controller errors
require('express-async-errors')

var authenticationController = require('../controllers/authentication')
var queryController = require('../controllers/queryAction')
var jobDetailsController = require('../controllers/jobDetails')
var retrieveController = require('../controllers/retrieveDicom')
var exportController = require('../controllers/exportDicom')
var aetsController = require('../controllers/aets')

const authUser = require('./auth_middelware')

// Route request to controllers
router.post('/authentication', authenticationController.getResults)

router.post('/query', authUser, queryController.getResults)

router.post('/job_details', authUser, jobDetailsController.getResults)

router.post('/retrieve', authUser, retrieveController.getResults)

router.post('/export_dicom', authUser, exportController.getResults)

//Robot routes
router.post('/robot', authUser, createRobot)
router.get('/robot', authUser, getRobotDetails)
router.get('/robot/:username', authUser, getRobotDetails)
router.delete('/robot/:username', authUser, deleteRobotJob)
router.delete('/robot/:username/:index', authUser, removeQueryFromJob)

//Options routes
router.get('/options', authUser, getSchedule)
router.put('/options', authUser, changeSchedule)


router.all('/aets', aetsController.getResults)

module.exports = router
