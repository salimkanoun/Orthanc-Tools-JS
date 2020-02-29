var express = require('express')
var router = express.Router()
// Handle controller errors
require('express-async-errors')

const { getRobotDetails, addRobotJob, validateRobotJob, deleteRobotJob, removeQueryFromJob } = require('../controllers/Robot')
const { changeSchedule, getSchedule, getOrthancServer, setOrthancServer, getOrthancSystem } = require('../controllers/options')
const { getAets, changeAets, echoAets, deleteAet } = require('../controllers/aets')
const { getJobData } = require('../controllers/jobDetails')
const { authentication } = require('../controllers/authentication')
const { postQuery } = require('../controllers/queryAction')
const { postRetrieve } = require('../controllers/retrieveDicom')
const { postExportDicom } = require('../controllers/exportDicom')

const { userAuthMidelware, userAdminMidelware } = require('./auth_middelware')

// Authentication route
router.post('/authentication', authentication)

// Query, retrieve, job, export routes
router.post('/query', userAuthMidelware, postQuery)
router.post('/retrieve', userAuthMidelware, postRetrieve)
router.get('/job_details/:id', userAuthMidelware, getJobData)
router.post('/export_dicom', userAuthMidelware, postExportDicom)

// Robot routes
router.post('/robot', userAuthMidelware, addRobotJob)
router.get('/robot', userAuthMidelware, getRobotDetails)
router.get('/robot/:username', userAuthMidelware, getRobotDetails)
router.delete('/robot/:username', userAuthMidelware, deleteRobotJob)
router.delete('/robot/:username/:index', userAuthMidelware, removeQueryFromJob)
router.post('/robot/:username/validate', [userAuthMidelware, userAdminMidelware], validateRobotJob)

// Options routes
router.get('/options', [userAuthMidelware, userAdminMidelware], getSchedule)
router.put('/options', [userAuthMidelware, userAdminMidelware], changeSchedule)
//Orthanc Settings routes
router.get('/options/orthanc-server', [userAuthMidelware, userAdminMidelware], getOrthancServer)
router.put('/options/orthanc-server', [userAuthMidelware, userAdminMidelware], setOrthancServer)
//Orthanc System
router.get('/options/orthanc-system', [userAuthMidelware, userAdminMidelware], getOrthancSystem)
getOrthancSystem

// Aets Routes
router.put('/aets', [userAuthMidelware, userAdminMidelware], changeAets)
router.get('/aets', userAuthMidelware, getAets)
router.get('/aets/:name/echo', [userAuthMidelware, userAdminMidelware], echoAets)
router.delete('/aets/:name', [userAuthMidelware, userAdminMidelware], deleteAet)



module.exports = router
