var express = require('express')
var adminRouter = express.Router()
// Handle controller errors
require('express-async-errors')

const { changeSchedule, updateRobotOptions, getOrthancServer, setOrthancServer, getMode, changeMode, getOptions } = require('../controllers/options')
const { reverseProxyGet, reverseProxyPost, reverseProxyPut, reverseProxyPutPlainText, reverseProxyDelete } = require('../controllers/reverseProxy')
const { getRoles, createRole, modifyRole, deleteRole, getPermission } = require('../controllers/role')

const { getLdapSettings, setLdapSettings, testLdapSettings, getLdapCorrespodences, 
        setLdapCorrespodence, deleteCorrespodence, getLdapGroupeNames } = require('../controllers/ldap')

const { userAuthMidelware, userAdminMidelware } = require('../midelwares/authentication')

const { allEndpoints, updateEndpoint, newEndpoint, removeEndpoint } = require('../controllers/endpoints')
const { newCertificate, allCertificates, updateCertificate, removeCertificate, uploadCertificate } = require('../controllers/certificates')
const { newKey, allKeys, updateKey, removeKey, uploadKey } = require('../controllers/sshKey')
const { getTasksOfType, validateRetrieve, flushTasks } = require('../controllers/task')

// OrthancToolsJS Options routes
adminRouter.get('/options', [userAuthMidelware, userAdminMidelware],  getOptions)
adminRouter.put('/options', [userAuthMidelware, userAdminMidelware], changeSchedule)

//Monitoring
//SK ROUTE A RENOMMER
adminRouter.put('/monitoring/burning/options', [userAuthMidelware, userAdminMidelware],updateRobotOptions)

// OrthancToolsJS Settings routes
adminRouter.get('/options/orthanc-server', [userAuthMidelware, userAdminMidelware], getOrthancServer)
adminRouter.put('/options/orthanc-server', [userAuthMidelware, userAdminMidelware], setOrthancServer)

// Orthanc System API
adminRouter.get('/system', [userAuthMidelware, userAdminMidelware], reverseProxyGet)

// Orthanc Job API
adminRouter.get('/jobs*', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
adminRouter.post('/jobs/*', [userAuthMidelware, userAdminMidelware], reverseProxyPost)

// Orthanc Aets Routes
adminRouter.delete('/modalities/*', [userAuthMidelware, userAdminMidelware], reverseProxyDelete)
adminRouter.post('/modalities/:dicom/echo', [userAuthMidelware, userAdminMidelware], reverseProxyPost)
adminRouter.put('/modalities/:dicom', [userAuthMidelware, userAdminMidelware], reverseProxyPut)

//Orthanc Peers Routes
adminRouter.get('/peers*', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
adminRouter.delete('/peers/*', [userAuthMidelware, userAdminMidelware], reverseProxyDelete)
adminRouter.get('/peers/:peer/system', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
adminRouter.put('/peers/:peer/', [userAuthMidelware, userAdminMidelware], reverseProxyPut)

//Orthanc reset - shutdown route
adminRouter.post('/tools/reset', [userAuthMidelware, userAdminMidelware], reverseProxyPost)
adminRouter.post('/tools/shutdown', [userAuthMidelware, userAdminMidelware], reverseProxyPost)

//Orthanc get and set Verbosity
adminRouter.get('/tools/log-level', [userAuthMidelware, userAdminMidelware], reverseProxyGet)
adminRouter.put('/tools/log-level', [userAuthMidelware, userAdminMidelware], reverseProxyPutPlainText)

//Orthanc Get plugins
adminRouter.get('/plugins', [userAuthMidelware, userAdminMidelware], reverseProxyGet)

//roles
adminRouter.get('/roles', [userAuthMidelware, userAdminMidelware], getRoles)
adminRouter.get('/roles/:name', [userAuthMidelware, userAdminMidelware], getPermission)
adminRouter.put('/roles', [userAuthMidelware, userAdminMidelware], modifyRole)
adminRouter.post('/roles', [userAuthMidelware, userAdminMidelware], createRole)
adminRouter.delete('/roles', [userAuthMidelware, userAdminMidelware], deleteRole)

//Mode
//SK A EXPLICITER C EST AUTHENTICATION MODE
adminRouter.get('/mode', [userAuthMidelware, userAdminMidelware], getMode)
adminRouter.put('/changeMode', [userAuthMidelware, userAdminMidelware], changeMode)

//Ldap
adminRouter.get('/ldap/settings', [userAuthMidelware, userAdminMidelware], getLdapSettings)
adminRouter.put('/ldap/settings', [userAuthMidelware, userAdminMidelware], setLdapSettings)
adminRouter.get('/ldap/test', [userAuthMidelware, userAdminMidelware], testLdapSettings)
adminRouter.post('/ldap/matches', [userAuthMidelware, userAdminMidelware], setLdapCorrespodence)
adminRouter.get('/ldap/matches', [userAuthMidelware, userAdminMidelware], getLdapCorrespodences)
adminRouter.delete('/ldap/matches', [userAuthMidelware, userAdminMidelware], deleteCorrespodence)
adminRouter.get('/ldap/groupname', [userAuthMidelware, userAdminMidelware], getLdapGroupeNames)

/*
** TASKS
*/

//OrthancToolsJS Task routes
adminRouter.post('/tasks/:username/retrieve/validate', [userAuthMidelware, userAdminMidelware], validateRetrieve)
adminRouter.get('/tasks/type/:type', [userAuthMidelware, userAdminMidelware], getTasksOfType)
adminRouter.delete('/tasks/type/:type/flush', [userAuthMidelware, userAdminMidelware], flushTasks)

/*
** REMOTE EXPORT
*/

// Export endpoints
adminRouter.get('/endpoints/', [userAuthMidelware, userAdminMidelware], allEndpoints)
adminRouter.post('/endpoints/update', [userAuthMidelware, userAdminMidelware], updateEndpoint)
adminRouter.post('/endpoints/create', [userAuthMidelware, userAdminMidelware], newEndpoint)
adminRouter.delete('/endpoints/', [userAuthMidelware, userAdminMidelware], removeEndpoint)

// Certificates
adminRouter.get('/certificates', [userAuthMidelware, userAdminMidelware], allCertificates)
adminRouter.put('/certificates/:id', [userAuthMidelware, userAdminMidelware], updateCertificate)
adminRouter.post('/certificates', [userAuthMidelware, userAdminMidelware], newCertificate)
adminRouter.delete('/certificates/:id', [userAuthMidelware, userAdminMidelware], removeCertificate)
adminRouter.post('/certificates/upload/:id', [userAuthMidelware, userAdminMidelware], uploadCertificate)

//Ssh keys
adminRouter.get('/keys', [userAuthMidelware, userAdminMidelware], allKeys)
adminRouter.post('/keys/update', [userAuthMidelware, userAdminMidelware], updateKey)
adminRouter.post('/keys/create', [userAuthMidelware, userAdminMidelware], newKey)
adminRouter.delete('/keys/', [userAuthMidelware, userAdminMidelware], removeKey)
adminRouter.post('/keys/upload/:id', [userAuthMidelware, userAdminMidelware], uploadKey)

module.exports = adminRouter