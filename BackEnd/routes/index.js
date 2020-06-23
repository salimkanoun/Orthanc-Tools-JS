var express = require('express')
var router = express.Router()
// Handle controller errors
require('express-async-errors')

const { authentication, logOut } = require('../controllers/authentication')
const { getRobotDetails, getAllRobotDetails, addRobotJob, validateRobotJob, deleteRobotJob, removeQueryFromJob } = require('../controllers/Robot2')
const { changeSchedule, getSchedule, getOrthancServer, setOrthancServer } = require('../controllers/options')
const { getParsedAnswer } = require('../controllers/query')
const { reverseProxyGet, reverseProxyPost, reverseProxyPostUploadDicom, reverseProxyPut, reverseProxyPutPlainText, reverseProxyDelete } = require('../controllers/reverseProxy')
const { anonymizeStudy } = require('../controllers/anonymize')
const { getUsers } = require('../controllers/user')

// SK Probalement a enlenver ne passer que par le reverse proxy
const { postRetrieve } = require('../controllers/retrieveDicom')
const { postExportDicom } = require('../controllers/exportDicom')

const { userAuthMidelware, userAdminMidelware, uploadMidelware, contentMidelware, anonMidelware, exportLocalMidelware,
    exportExternMidelware, queryMidelware, autoQueryMidelware, deleteMidelware } = require('../midelwares/authentication')


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
router.post('/session/*', authentication)
router.delete('/session', logOut)

router.post('/retrieve', userAuthMidelware, postRetrieve)

//OrthancToolsJS export to backend => SK A VOIR
router.post('/tools/orthanc-tools-js/create-archive', userAuthMidelware, postExportDicom)

// OrthancToolsJS Robot routes
router.post('/robot/:username/retrieve', userAuthMidelware, addRobotJob)
router.get('/robot/retrieve', userAdminMidelware, getAllRobotDetails)
router.get('/robot/:username/retrieve', userAuthMidelware, getRobotDetails)
router.delete('/robot/:username/:type', userAuthMidelware, deleteRobotJob)
router.delete('/robot/:username/retrieve/:index', userAuthMidelware, removeQueryFromJob)
router.post('/robot/:username/retrieve/validate', userAdminMidelware, validateRobotJob)

// OrthancToolsJS Options routes
router.get('/options', userAdminMidelware, getSchedule)
router.put('/options', userAdminMidelware, changeSchedule)
// OrthancToolsJS Settings routes
router.get('/options/orthanc-server', userAdminMidelware, getOrthancServer)
router.put('/options/orthanc-server', userAdminMidelware, setOrthancServer)

// OrthancToolsJS API to get simplified results from Orthanc
router.get('/queries/:orthancIdQuery/parsedAnswers', userAuthMidelware, getParsedAnswer)

// Orthanc Query Routes
router.post('/modalities/:modality/query', queryMidelware, reverseProxyPost)
router.get('/queries/:orthancIdQuery/answers*', queryMidelware, reverseProxyGet)

// Orthanc System API
router.get('/system', userAdminMidelware, reverseProxyGet)

// Orthanc Dicom Import Route
router.post('/instances', [userAuthMidelware], reverseProxyPostUploadDicom)

// Orthanc Job API
router.get('/jobs*', userAdminMidelware, reverseProxyGet)
router.post('/jobs/*/*', userAdminMidelware, reverseProxyPost)

// Orthanc Aets Routes
router.get('/modalities', userAuthMidelware, reverseProxyGet)
router.get('/modalities*', userAdminMidelware, reverseProxyGet)
router.delete('/modalities/*', userAdminMidelware, reverseProxyDelete)
router.post('/modalities/:dicom/echo', userAdminMidelware, reverseProxyPost)
router.put('/modalities/:dicom/', userAdminMidelware, reverseProxyPut)
router.post('/modalities/*/store',userAuthMidelware , reverseProxyPost )

// Orthanc DicomWebRoutes
router.get('/dicom-web/*', [userAuthMidelware], reverseProxyGet)
router.get('/wado/*', [userAuthMidelware], reverseProxyGet)

//Orthanc export routes
router.post('/tools/create-archive',[userAuthMidelware] , reverseProxyPost )
router.post('/tools/create-media-extended',[userAuthMidelware] , reverseProxyPost )

//Orthanc Peers Routes
router.get('/peers*', userAdminMidelware, reverseProxyGet)
router.delete('/peers/*', userAdminMidelware, reverseProxyDelete)
router.get('/peers/:peer/system', userAdminMidelware, reverseProxyGet)
router.put('/peers/:peer/', userAdminMidelware, reverseProxyPut)
router.post('/peers/*/store', userAuthMidelware , reverseProxyPost )

//Orthanc reset route
router.post('/tools/reset', userAdminMidelware, reverseProxyPost)

//Orthanc shutdown route
router.post('/tools/shutdown', userAdminMidelware, reverseProxyPost)

//Orthanc get and set Verbosity
router.get('/tools/log-level', userAdminMidelware, reverseProxyGet)
router.put('/tools/log-level', userAdminMidelware, reverseProxyPutPlainText)

//Orthanc content
router.post('/tools/find', userAdminMidelware, reverseProxyPost )
router.get('/patients/*', userAdminMidelware, reverseProxyGet)
router.post('/patients/*/modify', userAdminMidelware, reverseProxyPost)
router.get('/studies/*', userAdminMidelware, reverseProxyGet)
router.post('/studies/*/modify', userAdminMidelware, reverseProxyPost)
router.get('/series/*', userAdminMidelware, reverseProxyGet)
router.post('/series/*/modify', userAdminMidelware, reverseProxyPost)
router.delete('/patients/*', userAdminMidelware, reverseProxyDelete)
router.delete('/studies/*', userAdminMidelware, reverseProxyDelete)
router.delete('/series/*', userAdminMidelware, reverseProxyDelete)
router.get('/instances/*', userAdminMidelware, reverseProxyGet)

//plugins
router.get('/plugins', userAdminMidelware, reverseProxyGet)

//Anonymize simplified API
router.post('/anonymize', anonymizeStudy)

//user 
router.get('/user', getUsers)

module.exports = router
