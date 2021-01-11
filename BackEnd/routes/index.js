var express = require('express')
var router = express.Router()
// Handle controller errors
require('express-async-errors')

const { authentication, logOut } = require('../controllers/authentication')
const { changeSchedule, updateRobotOptions, getOrthancServer, setOrthancServer, getMode, changeMode, getOptions } = require('../controllers/options')
const { getParsedAnswer } = require('../controllers/query')
const { reverseProxyGet, reverseProxyPost, reverseProxyPostUploadDicom, reverseProxyPut, reverseProxyPutPlainText, reverseProxyDelete } = require('../controllers/reverseProxy')
const { getRoles, createRole, modifyRole, deleteRole, getPermission } = require('../controllers/role')


const { startBurner, getBurner, stopBurner, cancelJobBurner } = require('../controllers/monitoring')

const { getLdapSettings, setLdapSettings, testLdapSettings, getLdapCorrespodences, setLdapCorrespodence, deleteCorrespodence, getLdapGroupeNames} = require('../controllers/ldap')

// SK Probalement a enlenver ne passer que par le reverse proxy
const { postRetrieve } = require('../controllers/retrieveDicom')
const { postExportDicom } = require('../controllers/exportDicom')

const { userAuthMidelware, userAdminMidelware, importMidelware, contentMidelware, anonMidelware, exportLocalMidelware,
    exportExternMidelware, queryMidelware, autoQueryMidelware, deleteMidelware, modifyMidelware, isCurrentUserOrAdminMidelWare } = require('../midelwares/authentication')
const { route } = require('express/lib/router')
const { allEndpoints, updateEndpoint, newEndpoint, removeEndpoint } = require('../controllers/endpoints')
const { newCertificate, allCertificates, updateCertificate, removeCertificate, uploadCertificate} = require('../controllers/certificates')
const { newKey, allKeys, updateKey, removeKey, uploadKey} = require('../controllers/sshKey')
const { getTask, getTasks, getTasksIds, getTaskWithUser, getTasksOfType, deleteTask, deleteTaskOfUser, addAnonTask, addDeleteTask, addRetrieveTask, validateRetrieve, deleteRetrieveItem, addExportTask } = require('../controllers/task')


//Authentication midelware
router.post('/session/*', authentication)
router.delete('/session', logOut)


// OrthancToolsJS Options routes
router.get('/options', userAdminMidelware, getOptions)
router.put('/options', userAdminMidelware, changeSchedule)

// OrthancToolsJS Settings routes
router.get('/options/orthanc-server', userAdminMidelware, getOrthancServer)
router.put('/options/orthanc-server', userAdminMidelware, setOrthancServer)

// Orthanc System API
router.get('/system', userAdminMidelware, reverseProxyGet)

// Orthanc Job API
router.get('/jobs*', userAdminMidelware, reverseProxyGet)
router.post('/jobs/*', userAdminMidelware, reverseProxyPost)

// Orthanc Aets Routes
router.get('/modalities', userAdminMidelware, reverseProxyGet)
router.get('/modalities*', userAdminMidelware, reverseProxyGet)
router.delete('/modalities/*', userAdminMidelware, reverseProxyDelete)
router.post('/modalities/:dicom/echo', userAdminMidelware, reverseProxyPost)
router.put('/modalities/:dicom', userAdminMidelware, reverseProxyPut)
router.post('/modalities/*/store',exportLocalMidelware , reverseProxyPost )

// Orthanc Query / Retrieve Routes
router.post('/modalities/:modality/query', queryMidelware, reverseProxyPost)
router.get('/queries/:orthancIdQuery/answers*', queryMidelware, reverseProxyGet)
router.post('/retrieve', queryMidelware, postRetrieve)

// OrthancToolsJS API to get simplified results from Orthanc
router.get('/queries/:orthancIdQuery/parsedAnswers', queryMidelware, getParsedAnswer)

// Orthanc Dicom Import Route
router.post('/instances', importMidelware, reverseProxyPostUploadDicom)

// Orthanc DicomWebRoutes
router.get('/dicom-web/*' ,contentMidelware, reverseProxyGet)
router.get('/wado/*',contentMidelware, reverseProxyGet)

//Orthanc export routes
router.post('/tools/create-archive', exportLocalMidelware , reverseProxyPost )
router.post('/tools/create-media-extended', exportLocalMidelware , reverseProxyPost )

//Orthanc Peers Routes
router.get('/peers*', userAdminMidelware, reverseProxyGet)
router.delete('/peers/*', userAdminMidelware, reverseProxyDelete)
router.get('/peers/:peer/system', userAdminMidelware, reverseProxyGet)
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

//Mode
router.get('/mode', userAdminMidelware, getMode)
router.put('/changeMode', userAdminMidelware, changeMode)

//Ldap
router.get('/ldap/settings', userAdminMidelware, getLdapSettings)
router.put('/ldap/settings', userAdminMidelware, setLdapSettings)
router.get('/ldap/test', userAdminMidelware, testLdapSettings)
router.post('/ldap/matches', userAdminMidelware, setLdapCorrespodence)
router.get('/ldap/matches', userAdminMidelware, getLdapCorrespodences)
router.delete('/ldap/matches', userAdminMidelware, deleteCorrespodence)
router.get('/ldap/groupename', userAdminMidelware, getLdapGroupeNames)


//Monitoring
router.post('/monitoring/burner', startBurner)
router.delete('/monitoring/burner', stopBurner)
router.get('/monitoring/burner', getBurner)
router.post('/monitoring/burner/jobs/:jobBurnerId/cancel', cancelJobBurner)
router.put('/monitoring/burning/options', userAdminMidelware, updateRobotOptions)



/*
** TASKS
*/

//OrthancToolsJS Robot routes
//Retrieve Robot
router.post('/robot/:username/retrieve', autoQueryMidelware, addRetrieveTask)
router.post('/robot/:username/retrieve/validate', userAdminMidelware, validateRetrieve)

//AnonRobot
router.post('/robot/:username/anonymize', anonMidelware, addAnonTask)

//DeleteRobot
//SK BUG MIDELWARE DELETE?
router.post('/robot/:username/delete', deleteMidelware, addDeleteTask)

//FTP & WebDav Exports
router.post('/robot/:user/export', exportExternMidelware, addExportTask)

//Tasks
router.get('/tasks/:username/:type', getTaskWithUser)
router.delete('/tasks/:username/:type', deleteTaskOfUser)
router.delete('/tasks/:username/retrieve/:id', deleteRetrieveItem)
router.get('/tasks/:id',getTask)
router.delete('/tasks/:id',deleteTask)
router.get('/tasks',getTasksIds)
router.get('/tasks?expend',getTasks)
router.get('/robot/:type', userAdminMidelware, getTasksOfType)

/*
** REMOTE EXPORT
*/

// Export endpoints
router.get('/endpoints/', userAdminMidelware, allEndpoints)
router.post('/endpoints/update', userAdminMidelware, updateEndpoint)
router.post('/endpoints/create', userAdminMidelware, newEndpoint)
router.delete('/endpoints/', userAdminMidelware, removeEndpoint)

// Certificates
router.get('/certificates/', userAdminMidelware, allCertificates)
router.post('/certificates/update', userAdminMidelware, updateCertificate)
router.post('/certificates/create', userAdminMidelware, newCertificate)
router.delete('/certificates/', userAdminMidelware, removeCertificate)
router.post('/certificates/upload/:id',userAdminMidelware,uploadCertificate)

//Ssh keys
router.get('/keys/', userAdminMidelware, allKeys)
router.post('/keys/update', userAdminMidelware, updateKey)
router.post('/keys/create', userAdminMidelware, newKey)
router.delete('/keys/', userAdminMidelware, removeKey)
router.post('/keys/upload/:id', userAdminMidelware, uploadKey)

module.exports = router