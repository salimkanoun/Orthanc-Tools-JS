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
const { getTasksOfType, validateRetrieve } = require('../controllers/task')

//These routes needs authentication + admin authorization
adminRouter.use([userAuthMidelware, userAdminMidelware])

// OrthancToolsJS Options routes
adminRouter.get('/options', getOptions)
adminRouter.put('/options', changeSchedule)

//Monitoring
//SK ROUTE A RENOMMER
adminRouter.put('/monitoring/burning/options', updateRobotOptions)

// OrthancToolsJS Settings routes
adminRouter.get('/options/orthanc-server', getOrthancServer)
adminRouter.put('/options/orthanc-server', setOrthancServer)

// Orthanc System API
adminRouter.get('/system', reverseProxyGet)

// Orthanc Job API
adminRouter.get('/jobs*', reverseProxyGet)
adminRouter.post('/jobs/*', reverseProxyPost)

// Orthanc Aets Routes
adminRouter.get('/modalities*', reverseProxyGet)
adminRouter.delete('/modalities/*', reverseProxyDelete)
adminRouter.post('/modalities/:dicom/echo', reverseProxyPost)
adminRouter.put('/modalities/:dicom', reverseProxyPut)

//Orthanc Peers Routes
adminRouter.get('/peers*', reverseProxyGet)
adminRouter.delete('/peers/*', reverseProxyDelete)
adminRouter.get('/peers/:peer/system', reverseProxyGet)
adminRouter.put('/peers/:peer/', reverseProxyPut)

//Orthanc reset - shutdown route
adminRouter.post('/tools/reset', reverseProxyPost)
adminRouter.post('/tools/shutdown', reverseProxyPost)

//Orthanc get and set Verbosity
adminRouter.get('/tools/log-level', reverseProxyGet)
adminRouter.put('/tools/log-level', reverseProxyPutPlainText)

//Orthanc Get plugins
adminRouter.get('/plugins', reverseProxyGet)

//roles
adminRouter.get('/roles', getRoles)
adminRouter.get('/roles/:name', getPermission)
adminRouter.put('/roles', modifyRole)
adminRouter.post('/roles', createRole)
adminRouter.delete('/roles', deleteRole)

//Mode
//SK A EXPLICITER C EST AUTHENTICATION MODE
adminRouter.get('/mode', getMode)
adminRouter.put('/changeMode', changeMode)

//Ldap
adminRouter.get('/ldap/settings', getLdapSettings)
adminRouter.put('/ldap/settings', setLdapSettings)
adminRouter.get('/ldap/test', testLdapSettings)
adminRouter.post('/ldap/matches', setLdapCorrespodence)
adminRouter.get('/ldap/matches', getLdapCorrespodences)
adminRouter.delete('/ldap/matches', deleteCorrespodence)
adminRouter.get('/ldap/groupname', getLdapGroupeNames)

/*
** TASKS
*/

//OrthancToolsJS Robot routes
//Retrieve Robot
//SK A UNIFORMISER
adminRouter.post('/tasks/:username/retrieve/validate', validateRetrieve)
adminRouter.get('/tasks/type/:type', getTasksOfType)

/*
** REMOTE EXPORT
*/

// Export endpoints
adminRouter.get('/endpoints/', allEndpoints)
adminRouter.post('/endpoints/update', updateEndpoint)
adminRouter.post('/endpoints/create', newEndpoint)
adminRouter.delete('/endpoints/', removeEndpoint)

// Certificates
adminRouter.get('/certificates', allCertificates)
adminRouter.put('/certificates/:id', updateCertificate)
adminRouter.post('/certificates', newCertificate)
adminRouter.delete('/certificates/:id', removeCertificate)
adminRouter.post('/certificates/upload/:id', uploadCertificate)

//Ssh keys
adminRouter.get('/keys', allKeys)
adminRouter.post('/keys/update', updateKey)
adminRouter.post('/keys/create', newKey)
adminRouter.delete('/keys/', removeKey)
adminRouter.post('/keys/upload/:id', uploadKey)

module.exports = adminRouter