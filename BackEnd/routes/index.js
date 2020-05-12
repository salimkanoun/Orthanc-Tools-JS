var express = require('express')
var router = express.Router()
// Handle controller errors
require('express-async-errors')

const { authentication } = require('../controllers/authentication')
const { getRobotDetails, getAllRobotDetails, addRobotJob, validateRobotJob, deleteRobotJob, removeQueryFromJob } = require('../controllers/Robot')
const { changeSchedule, getSchedule, getOrthancServer, setOrthancServer } = require('../controllers/options')
const { getParsedAnswer } = require('../controllers/query')
const { reverseProxyGet, reverseProxyPost, reverseProxyPostUploadDicom, reverseProxyPut, reverseProxyPutPlainText, reverseProxyDelete } = require('../controllers/reverseProxy')
const { anonymizeStudy } = require('../controllers/anonymize')

// SK Probalement a enlenver ne passer que par le reverse proxy
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

router.post('/retrieve', userAuthMidelware, postRetrieve)

//OrthancToolsJS export to backend => SK A VOIR
router.post('/tools/orthanc-tools-js/create-archive', userAuthMidelware, postExportDicom)

// OrthancToolsJS Robot routes
router.post('/robot', userAuthMidelware, addRobotJob)
router.get('/robot', [userAuthMidelware, userAdminMidelware], getAllRobotDetails)
router.get('/robot/:username', userAuthMidelware, getRobotDetails)
router.delete('/robot/:username', userAuthMidelware, deleteRobotJob)
router.delete('/robot/:username/:index', userAuthMidelware, removeQueryFromJob)
router.post('/robot/:username/validate', [userAuthMidelware, userAdminMidelware], validateRobotJob)

// OrthancToolsJS Options routes
router.get('/options', [userAuthMidelware, userAdminMidelware], getSchedule)
router.put('/options', [userAuthMidelware, userAdminMidelware], changeSchedule)
// OrthancToolsJS Settings routes
router.get('/options/orthanc-server', [userAuthMidelware, userAdminMidelware], getOrthancServer)
router.put('/options/orthanc-server', [userAuthMidelware, userAdminMidelware], setOrthancServer)

// OrthancToolsJS API to get simplified results from Orthanc
router.get('/queries/:orthancIdQuery/parsedAnswers', userAuthMidelware, getParsedAnswer)

// Orthanc Query Routes
router.post('/modalities/:modality/query', userAuthMidelware, reverseProxyPost)
router.get('/queries/:orthancIdQuery/answers*', userAuthMidelware, reverseProxyGet)

// Orthanc System API
router.get('/system', [userAuthMidelware, userAdminMidelware], reverseProxyGet)

// Orthanc Dicom Import Route
router.post('/instances', [userAuthMidelware], reverseProxyPostUploadDicom)

// Orthanc Job API
router.get('/jobs*', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
router.post('/jobs/*/cancel', [userAuthMidelware, userAdminMidelware], reverseProxyPost)

// Orthanc Aets Routes
router.get('/modalities', userAuthMidelware, reverseProxyGet)
router.get('/modalities*', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
router.delete('/modalities/*', [userAuthMidelware, userAdminMidelware], reverseProxyDelete)
router.post('/modalities/:dicom/echo', [userAuthMidelware, userAdminMidelware], reverseProxyPost)
router.put('/modalities/:dicom/', [[userAuthMidelware, userAdminMidelware]], reverseProxyPut)
router.post('/modalities/*/store',userAuthMidelware , reverseProxyPost )

// Orthanc DicomWebRoutes
router.get('/dicom-web/*', [userAuthMidelware], reverseProxyGet)
router.get('/wado/*', [userAuthMidelware], reverseProxyGet)

//Orthanc export routes
router.post('/tools/create-archive',[userAuthMidelware] , reverseProxyPost )
router.post('/tools/create-media-extended',[userAuthMidelware] , reverseProxyPost )

//Orthanc Peers Routes
router.get('/peers*', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
router.delete('/peers/*', [userAuthMidelware, userAdminMidelware], reverseProxyDelete)
router.get('/peers/:peer/system', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
router.put('/peers/:peer/', [userAuthMidelware, userAdminMidelware], reverseProxyPut)
router.post('/peers/*/store', userAuthMidelware , reverseProxyPost )

//Orthanc reset route
router.post('/tools/reset', [userAuthMidelware, userAdminMidelware], reverseProxyPost)

//Orthanc shutdown route
router.post('/tools/shutdown', [userAuthMidelware, userAdminMidelware], reverseProxyPost)

//Orthanc get and set Verbosity
router.get('/tools/log-level', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
router.put('/tools/log-level', [userAuthMidelware, userAdminMidelware], reverseProxyPutPlainText)

//Orthanc content
router.post('/tools/find',  [userAuthMidelware, userAdminMidelware], reverseProxyPost )
router.get('/patients/*', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
router.get('/studies/*', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
router.get('/series/*', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
router.delete('/patients/*', [userAuthMidelware, userAdminMidelware], reverseProxyDelete)
router.delete('/studies/*', [userAuthMidelware, userAdminMidelware], reverseProxyDelete)
router.delete('/series/*', [userAuthMidelware, userAdminMidelware], reverseProxyDelete)

//Anonymize simplified API
router.post('/anonymize', anonymizeStudy)

module.exports = router
