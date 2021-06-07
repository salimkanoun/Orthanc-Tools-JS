var express = require('express')
var adminRouter = express.Router()
// Handle controller errors
require('express-async-errors')

const {
    changeSchedule,
    updateRobotOptions,
    getOrthancServer,
    setOrthancServer,
    getMode,
    changeMode,
    getOptions,
    getRedisServer,
    setRedisServer,
    setExportOption
} = require('../controllers/options')
const {
    reverseProxyGet,
    reverseProxyPost,
    reverseProxyPut,
    reverseProxyPutPlainText,
    reverseProxyDelete
} = require('../controllers/reverseProxy')
const {getRoles, createRole, modifyRole, deleteRole, getPermission} = require('../controllers/role')

const {
    getLdapSettings, setLdapSettings, testLdapSettings, getLdapCorrespondences,
    setLdapCorrespondence, deleteCorrespondence, getLdapGroupeNames
} = require('../controllers/ldap')

const {userAuthMidelware, userAdminMidelware, roleAccessLabelMidelware, autoroutingMidelware} = require('../midelwares/authentication')

const {allEndpoints, updateEndpoint, newEndpoint, removeEndpoint} = require('../controllers/endpoints')
const {newCertificate, allCertificates, removeCertificate, uploadCertificate} = require('../controllers/certificates')
const {newKey, allKeys, updateKey, removeKey, uploadKey} = require('../controllers/sshKey')
const {getTasksOfType, validateRetrieve, flushTasks} = require('../controllers/task')

const {getLabels, createLabel, modifyLabel, deleteLabel} = require('../controllers/label')
const {
    createRoleLabel, deleteRoleLabel, getAllRolesLabels, getLabelRoles, getRoleLabels
} = require('../controllers/roleLabel')
const {
    getStudiesLabels,
    createStudyLabel,
    deleteStudyLabel,
    getStudiesLabel,
    getStudyLabels,
    getStudyLabelsByStudyOrthancID
} = require('../controllers/studyLabel')

const{
    createAutorouter,
    getAutorouterById,
    getAutorouters,
    switchOnOff,
    modifyAutorouter,
    deleteAutorouter,
} = require('../controllers/autorouter')


// OrthancToolsJS Options routes
adminRouter.get('/options', [userAuthMidelware, userAdminMidelware], getOptions)
adminRouter.put('/options', [userAuthMidelware, userAdminMidelware], changeSchedule)

//Monitoring
//SK ROUTE A RENOMMER
adminRouter.put('/monitoring/burning/options', [userAuthMidelware, userAdminMidelware], updateRobotOptions)

// OrthancToolsJS Settings routes
adminRouter.get('/options/orthanc', [userAuthMidelware, userAdminMidelware], getOrthancServer)
adminRouter.put('/options/orthanc', [userAuthMidelware, userAdminMidelware], setOrthancServer)
adminRouter.get('/options/redis', [userAuthMidelware, userAdminMidelware], getRedisServer)
adminRouter.put('/options/redis', [userAuthMidelware, userAdminMidelware], setRedisServer)
adminRouter.put('/options/export', [userAuthMidelware, userAdminMidelware], setExportOption)

// Orthanc System API
adminRouter.get('/system', [userAuthMidelware, userAdminMidelware], reverseProxyGet)

// Orthanc Job API
adminRouter.post('/jobs/*', [userAuthMidelware, userAdminMidelware], reverseProxyPost)

// Orthanc Aets Routes
adminRouter.delete('/modalities/*', [userAuthMidelware, userAdminMidelware], reverseProxyDelete)
adminRouter.post('/modalities/:dicom/echo', [userAuthMidelware, userAdminMidelware], reverseProxyPost)
adminRouter.put('/modalities/:dicom', [userAuthMidelware, userAdminMidelware], reverseProxyPut)

//Orthanc Peers Routes
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
adminRouter.post('/ldap/matches', [userAuthMidelware, userAdminMidelware], setLdapCorrespondence)
adminRouter.get('/ldap/matches', [userAuthMidelware, userAdminMidelware], getLdapCorrespondences)
adminRouter.delete('/ldap/matches', [userAuthMidelware, userAdminMidelware], deleteCorrespondence)
adminRouter.get('/ldap/groupname', [userAuthMidelware, userAdminMidelware], getLdapGroupeNames)

/*
** TASKS
*/

//OrthancToolsJS Task routes
adminRouter.post('/tasks/retrieve/:id/validate', [userAuthMidelware, userAdminMidelware], validateRetrieve)
adminRouter.get('/tasks/type/:type', [userAuthMidelware, userAdminMidelware], getTasksOfType)
adminRouter.delete('/tasks/type/:type/flush', [userAuthMidelware, userAdminMidelware], flushTasks)

/*
** REMOTE EXPORT
*/

// Export endpoints
adminRouter.get('/endpoints/', [userAuthMidelware, userAdminMidelware], allEndpoints)
adminRouter.put('/endpoints/', [userAuthMidelware, userAdminMidelware], updateEndpoint)
adminRouter.post('/endpoints/', [userAuthMidelware, userAdminMidelware], newEndpoint)
adminRouter.delete('/endpoints/', [userAuthMidelware, userAdminMidelware], removeEndpoint)

// Certificates
adminRouter.get('/certificates', [userAuthMidelware, userAdminMidelware], allCertificates)
//adminRouter.put('/certificates/:id', [userAuthMidelware, userAdminMidelware], updateCertificate)
adminRouter.post('/certificates', [userAuthMidelware, userAdminMidelware], newCertificate)
adminRouter.delete('/certificates/:id', [userAuthMidelware, userAdminMidelware], removeCertificate)
adminRouter.post('/certificates/upload/:id', [userAuthMidelware, userAdminMidelware], uploadCertificate)

//Ssh keys
adminRouter.get('/keys', [userAuthMidelware, userAdminMidelware], allKeys)
adminRouter.put('/keys/', [userAuthMidelware, userAdminMidelware], updateKey)
adminRouter.post('/keys/', [userAuthMidelware, userAdminMidelware], newKey)
adminRouter.delete('/keys/', [userAuthMidelware, userAdminMidelware], removeKey)
adminRouter.post('/keys/upload/:id', [userAuthMidelware, userAdminMidelware], uploadKey)

/*
**LABELS
*/
// Labels
adminRouter.get('/labels', [userAuthMidelware], getLabels)
adminRouter.put('/labels/:name', [userAuthMidelware, userAdminMidelware], modifyLabel)
adminRouter.post('/labels/:name', [userAuthMidelware, userAdminMidelware], createLabel)
adminRouter.delete('/labels/:name', [userAuthMidelware, userAdminMidelware], deleteLabel)

//RoleLabel
adminRouter.get('/users/labels', [userAuthMidelware,userAdminMidelware], getAllRolesLabels)
adminRouter.get('/users/labels/:label', [userAuthMidelware,roleAccessLabelMidelware], getLabelRoles)
adminRouter.get('/users/:name/roles/:role_name/labels', [userAuthMidelware], getRoleLabels)
adminRouter.post('/users/:name/labels/:name', [userAuthMidelware, userAdminMidelware], createRoleLabel)
adminRouter.delete('/users/:name/labels/:name', [userAuthMidelware, userAdminMidelware], deleteRoleLabel)

//StudyLabel
adminRouter.get('/studies/labels', [userAuthMidelware,userAdminMidelware], getStudiesLabels)
adminRouter.get('/studies/labels/:name', [userAuthMidelware,roleAccessLabelMidelware], getStudiesLabel)
adminRouter.get('/studies/orthanc/:id/labels',[userAuthMidelware,userAdminMidelware], getStudyLabelsByStudyOrthancID)
adminRouter.get('/studies/:uid/labels/', [userAuthMidelware,userAdminMidelware], getStudyLabels)
adminRouter.post('/patient/:id/studies/:uid/labels/:name', [userAuthMidelware, userAdminMidelware], createStudyLabel)
adminRouter.delete('/studies/:uid/labels/:name', [userAuthMidelware, userAdminMidelware], deleteStudyLabel)

/*
**AUTO ROUTING
*/
adminRouter.get('/autorouting',[userAuthMidelware, autoroutingMidelware],getAutorouters)
adminRouter.get('/autorouting/:id',[userAuthMidelware, autoroutingMidelware],getAutorouterById)
adminRouter.post('/autorouting/:name',[userAuthMidelware, autoroutingMidelware],createAutorouter)
adminRouter.put('/autorouting/:id',[userAuthMidelware, autoroutingMidelware],modifyAutorouter)
adminRouter.put('/autorouting/:id/running',[userAuthMidelware, autoroutingMidelware],switchOnOff)
adminRouter.delete('/autorouting/:id',[userAuthMidelware, autoroutingMidelware],deleteAutorouter)

module.exports = adminRouter