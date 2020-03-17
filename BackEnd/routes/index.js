var express = require('express')
var router = express.Router()
// Handle controller errors
require('express-async-errors')

const { getRobotDetails, addRobotJob, validateRobotJob, deleteRobotJob, removeQueryFromJob } = require('../controllers/Robot')
const { changeSchedule, getSchedule, getOrthancServer, setOrthancServer, getOrthancSystem } = require('../controllers/options')
const { getAets, changeAets, echoAets, deleteAet } = require('../controllers/aets')
const { getJobData } = require('../controllers/jobDetails')
const { authentication } = require('../controllers/authentication')
const { getParsedAnswer } = require('../controllers/queryAction')
const { postRetrieve } = require('../controllers/retrieveDicom')
const { postExportDicom } = require('../controllers/exportDicom')
const { reverseProxyGet, reverseProxyPost } = require('../controllers/reverseProxy')

const { userAuthMidelware, userAdminMidelware } = require('../midelwares/authentication')

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

 /**
 * @swagger
 * path:
 *  /authentication/:
 *    post:
 *      summary: Authentify User
 *      tags: [Users]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses:
 *        "200":
 *          description: Sucess
 *        "401":
 *          description: Unauthorized
 */
router.post('/authentication', authentication)

// Query, retrieve, job, export routes

//Query Route
router.post('/modalities/:modality/query', userAuthMidelware, reverseProxyPost)
router.get('/queries/:orthancIdQuery/answers*', userAuthMidelware, reverseProxyGet)
router.get('/queries/:orthancIdQuery/parsedAnswers', userAuthMidelware, getParsedAnswer)

router.post('/retrieve', userAuthMidelware, postRetrieve)
router.get('/jobs/:jobId', userAuthMidelware, getJobData)
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

// Aets Routes
router.put('/aets', [userAuthMidelware, userAdminMidelware], changeAets)
router.get('/aets', userAuthMidelware, getAets)
router.get('/aets/:name/echo', [userAuthMidelware, userAdminMidelware], echoAets)
router.delete('/aets/:name', [userAuthMidelware, userAdminMidelware], deleteAet)

//DicomWebRoutes
router.get('/dicom-web/*', [userAuthMidelware], reverseProxyGet)
router.get('/wado/*', [userAuthMidelware], reverseProxyGet)

module.exports = router
