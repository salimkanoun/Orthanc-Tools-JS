var express = require('express')
var router = express.Router()
// Handle controller errors
require('express-async-errors')

const { authentication, logOut } = require('../controllers/authentication')
const { getRobotDetails, getAllRobotDetails, addRobotJob, validateRobotJob, deleteRobotJob, removeQueryFromJob, addAnonJob, getAnonJob, getDeleteJob, addDeleteJob } = require('../controllers/Robot2')
const { changeSchedule, getSchedule, getOrthancServer, setOrthancServer, getMode, changeMode } = require('../controllers/options')
const { getParsedAnswer } = require('../controllers/query')
const { reverseProxyGet, reverseProxyPost, reverseProxyPostUploadDicom, reverseProxyPut, reverseProxyPutPlainText, reverseProxyDelete } = require('../controllers/reverseProxy')
const { getRoles, createRole, modifyRole, deleteRole, getPermission, getRoleFromToken } = require('../controllers/role')

const { test,test2 } = require('../controllers/monitoring')

const { getLdapSettings, setLdapSettings, testLdapSettings } = require('../controllers/ldap')

// SK Probalement a enlenver ne passer que par le reverse proxy
const { postRetrieve } = require('../controllers/retrieveDicom')
const { postExportDicom } = require('../controllers/exportDicom')

const { userAuthMidelware, userAdminMidelware, importMidelware, contentMidelware, anonMidelware, exportLocalMidelware,
    exportExternMidelware, queryMidelware, autoQueryMidelware, deleteMidelware, modifyMidelware } = require('../midelwares/authentication')


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

//OrthancToolsJS export to backend => SK A VOIR
//router.post('/tools/orthanc-tools-js/create-archive', userAuthMidelware, postExportDicom)

//OrthancToolsJS Robot routes
//Retrieve Robot
router.post('/robot/:username/retrieve', autoQueryMidelware, addRobotJob)
router.get('/robot/:username/retrieve', autoQueryMidelware, getRobotDetails)
router.delete('/robot/:username/retrieve/:index', autoQueryMidelware, removeQueryFromJob)
router.get('/robot/retrieve', userAdminMidelware, getAllRobotDetails)
router.post('/robot/:username/retrieve/validate', userAdminMidelware, validateRobotJob)
//AnonRobot
router.post('/robot/:username/anonymize', anonMidelware, addAnonJob)
router.get('/robot/:username/anonymize', anonMidelware, getAnonJob)
//DeleteRobot
//SK BUG MIDELWARE DELETE?
router.post('/robot/:username/delete', userAuthMidelware, addDeleteJob)
router.get('/robot/:username/delete', userAuthMidelware, getDeleteJob)

//Removal of Robots
//SK ICI MIDELWARE EN FONCTION DU TYPE?
router.delete('/robot/:username/:type', userAuthMidelware, deleteRobotJob)

// OrthancToolsJS Options routes
router.get('/options', userAdminMidelware, getSchedule)
router.put('/options', userAdminMidelware, changeSchedule)
// OrthancToolsJS Settings routes
router.get('/options/orthanc-server', userAdminMidelware, getOrthancServer)
router.put('/options/orthanc-server', userAdminMidelware, setOrthancServer)
// Orthanc System API
router.get('/system', userAdminMidelware, reverseProxyGet)
// Orthanc Job API
router.get('/jobs*', userAuthMidelware, reverseProxyGet)
router.post('/jobs/*', userAuthMidelware, reverseProxyPost)
// Orthanc Aets Routes
router.get('/modalities', userAuthMidelware, reverseProxyGet)
router.get('/modalities*', userAuthMidelware, reverseProxyGet)
router.delete('/modalities/*', userAuthMidelware, reverseProxyDelete)
router.post('/modalities/:dicom/echo', userAuthMidelware, reverseProxyPost)
router.put('/modalities/:dicom/', userAdminMidelware, reverseProxyPut)
router.post('/modalities/*/store',exportLocalMidelware , reverseProxyPost )

// Orthanc Query / Retrieve Routes
router.post('/modalities/:modality/query', queryMidelware, reverseProxyPost)
router.get('/queries/:orthancIdQuery/answers*', queryMidelware, reverseProxyGet)
router.post('/retrieve', queryMidelware, postRetrieve)
// OrthancToolsJS API to get simplified results from Orthanc
router.get('/queries/:orthancIdQuery/parsedAnswers', queryMidelware, getParsedAnswer)

// Orthanc Dicom Import Route
//SK Middelware manquant
router.post('/instances', importMidelware, reverseProxyPostUploadDicom)

// Orthanc DicomWebRoutes
//SK ICI AJOUTER CONTENT MIDDELWARE QUAND OHIF POURRA INJECTER LE JWT DANS TOUTES LES REQUETES
router.get('/dicom-web/*', reverseProxyGet)
router.get('/wado/*', reverseProxyGet)

//Orthanc export routes
router.post('/tools/create-archive', exportLocalMidelware , reverseProxyPost )
router.post('/tools/create-media-extended', exportLocalMidelware , reverseProxyPost )

//Orthanc Peers Routes
router.get('/peers*', userAuthMidelware, reverseProxyGet)
router.delete('/peers/*', userAuthMidelware, reverseProxyDelete)
router.get('/peers/:peer/system', userAuthMidelware, reverseProxyGet)
router.put('/peers/:peer/', userAdminMidelware, reverseProxyPut)
router.post('/peers/*/store', exportExternMidelware , reverseProxyPost )

//Orthanc reset route
router.post('/tools/reset', userAdminMidelware, reverseProxyPost)

//Orthanc shutdown route
router.post('/tools/shutdown', userAdminMidelware, reverseProxyPost)

//Orthanc get and set Verbosity
router.get('/tools/log-level', userAdminMidelware, reverseProxyGet)
router.put('/tools/log-level', userAdminMidelware, reverseProxyPutPlainText)

//Orthanc content
router.post('/tools/find', contentMidelware, reverseProxyPost )
router.get('/patients/*', contentMidelware, reverseProxyGet)
router.post('/patients/*/modify', contentMidelware, reverseProxyPost)
router.get('/studies/*', contentMidelware, reverseProxyGet)
router.post('/studies/*/modify', contentMidelware, reverseProxyPost)
router.get('/series/*', contentMidelware, reverseProxyGet)
router.post('/series/*/modify', contentMidelware, reverseProxyPost)
router.delete('/patients/*', contentMidelware, reverseProxyDelete)
router.delete('/studies/*', contentMidelware, reverseProxyDelete)
router.delete('/series/*', contentMidelware, reverseProxyDelete)
router.get('/instances/*', contentMidelware, reverseProxyGet)
//plugins
router.get('/plugins', userAdminMidelware, reverseProxyGet)

//roles
router.get('/roles', userAdminMidelware, getRoles)
router.get('/roles/:name', userAdminMidelware, getPermission)
router.put('/roles', userAdminMidelware, modifyRole)
router.post('/roles', userAdminMidelware, createRole)
router.delete('/roles', userAdminMidelware, deleteRole)

//token
router.get('/token', userAuthMidelware, getRoleFromToken)

//Mode
router.get('/mode', userAdminMidelware, getMode)
router.put('/changeMode', userAdminMidelware, changeMode)

//Ldap
router.get('/ldapSettings', userAdminMidelware, getLdapSettings)
router.post('/ldapSettings', userAdminMidelware, setLdapSettings)
router.get('/ldapTestCo', userAdminMidelware, testLdapSettings)

//Monitoring
router.head('/monitoring', test2)

module.exports = router