var express = require('express')
var router = express.Router()
// Handle controller errors
require('express-async-errors')

const { authentication } = require('../controllers/authentication')
const { getRobotDetails, addRobotJob, validateRobotJob, deleteRobotJob, removeQueryFromJob } = require('../controllers/Robot')
const { changeSchedule, getSchedule, getOrthancServer, setOrthancServer, getOrthancSystem } = require('../controllers/options')
const { getParsedAnswer } = require('../controllers/query')
const { reverseProxyGet, reverseProxyPost, reverseProxyPostUploadDicom, reverseProxyPut, reverseProxyDelete } = require('../controllers/reverseProxy')

//SK Probalement a enlenver ne passer que par le reverse proxy
const { getJobData } = require('../controllers/jobDetails')
const { postRetrieve } = require('../controllers/retrieveDicom')
const { postExportDicom } = require('../controllers/exportDicom')


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
//Custom API to get simplified results from Orthanc
router.get('/queries/:orthancIdQuery/parsedAnswers', userAuthMidelware, getParsedAnswer)
//Dicom Import Routes
router.post('/instances', [userAuthMidelware], reverseProxyPostUploadDicom)

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

// Aets Routes follows Orthanc APIS
router.get('/modalities', userAuthMidelware, reverseProxyGet)
router.get('/modalities*', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
router.delete('/modalities/*', [userAuthMidelware, userAdminMidelware], reverseProxyDelete)
router.post('/modalities/:dicom/echo', [userAuthMidelware, userAdminMidelware], reverseProxyPost)
router.put('/modalities/:dicom/', [[userAuthMidelware, userAdminMidelware]], reverseProxyPut)


//DicomWebRoutes
router.get('/dicom-web/*', [userAuthMidelware], reverseProxyGet)
router.get('/wado/*', [userAuthMidelware], reverseProxyGet)

module.exports = router
