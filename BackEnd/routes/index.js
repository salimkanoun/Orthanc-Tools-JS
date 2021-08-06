var express = require('express')
var router = express.Router()
// Handle controller errors
require('express-async-errors')

const {getParsedAnswer, postRetrieve} = require('../controllers/queryRetrieve')
const {
    reverseProxyGet,
    reverseProxyPost,
    reverseProxyPostUploadDicom,
    reverseProxyDelete
} = require('../controllers/reverseProxy')
const {
    startBurner,
    getBurner,
    stopBurner,
    cancelJobBurner,
    startAutorouter,
    stopAutorouter,
    getAutorouter
} = require('../controllers/monitoring')

const {
    importMidelware,
    contentMidelware,
    anonMidelware,
    exportLocalMidelware,
    exportExternMidelware,
    queryMidelware,
    autoQueryMidelware,
    deleteMidelware,
    modifyMidelware,
    cdBurnerMidelware,
    isCurrentUserOrAdminMidelWare,
    userAuthMidelware,
    userAdminMidelware,
    ownTaskOrIsAdminMidelware,
    autoroutingMidelware
} = require('../midelwares/authentication')

const {
    checkForOrthancQueueReady,
    getTask,
    getTasks,
    getTasksIds,
    getTaskWithUser,
    getTasksOfType,
    deleteTask,
    deleteTaskOfUser,
    addAnonTask,
    addDeleteTask,
    addRetrieveTask,
    deleteRetrieveItem,
    addExportTask, retryRetrieveItem
} = require('../controllers/task')

const {allEndpoints} = require('../controllers/endpoints')
const {getExportTranscoding} = require('../controllers/options')

router.get('/modalities', userAuthMidelware, reverseProxyGet)
router.post('/modalities/*/store', [userAuthMidelware, exportLocalMidelware], reverseProxyPost)

// Orthanc Query / Retrieve Routes
router.post('/modalities/:modality/query', [userAuthMidelware, queryMidelware], reverseProxyPost)
router.get('/queries/:orthancIdQuery/answers*', [userAuthMidelware, queryMidelware], reverseProxyGet)
router.post('/retrieve', [userAuthMidelware, queryMidelware], postRetrieve)

// OrthancToolsJS API to get simplified results from Orthanc
router.get('/queries/:orthancIdQuery/parsedAnswers', [userAuthMidelware, queryMidelware], getParsedAnswer)

// Orthanc Dicom Import Route
router.post('/instances', [userAuthMidelware, importMidelware], reverseProxyPostUploadDicom)

//Orthanc export routes
router.post('/tools/create-archive', [userAuthMidelware, exportLocalMidelware], reverseProxyPost)
router.post('/tools/create-media-extended', [userAuthMidelware, exportLocalMidelware], reverseProxyPost)

//Orthanc Create Dicom Route
router.post('/tools/create-dicom', [userAuthMidelware, importMidelware], reverseProxyPost)

//Orthanc Peers Routes
router.get('/peers*', [userAuthMidelware, exportExternMidelware], reverseProxyGet)
router.post('/peers/*/store', [userAuthMidelware, exportExternMidelware], reverseProxyPost)

//Jobs to monitor orthanc
router.get('/jobs*', [userAuthMidelware], reverseProxyGet)

//Orthanc Modify
router.post('/patients/*/modify', [userAuthMidelware, modifyMidelware], reverseProxyPost)
router.post('/studies/*/modify', [userAuthMidelware, modifyMidelware], reverseProxyPost)
router.post('/series/*/modify', [userAuthMidelware, modifyMidelware], reverseProxyPost)

//Tools Find API for Orthanc Content Role
router.post('/tools/find', [userAuthMidelware, contentMidelware], reverseProxyPost)

//Reverse Proxy Routes for orthanc content => Warning non RBAC Protected
//SK A VERIFIER QUE LES RACINES SONT BIEN VEROUILLEES
router.get('/patients/*', [userAuthMidelware], reverseProxyGet)
router.get('/studies/*', [userAuthMidelware], reverseProxyGet)
router.get('/series/*', [userAuthMidelware], reverseProxyGet)
router.get('/instances/*', [userAuthMidelware], reverseProxyGet)
router.get('/dicom-web/*', [userAuthMidelware], reverseProxyGet)
router.get('/wado/*', [userAuthMidelware], reverseProxyGet)

//Delete Orthanc ressource API
router.delete('/patients/*', [userAuthMidelware, deleteMidelware], reverseProxyDelete)
router.delete('/studies/*', [userAuthMidelware, deleteMidelware], reverseProxyDelete)
router.delete('/series/*', [userAuthMidelware, deleteMidelware], reverseProxyDelete)

//Monitoring
//cdBurner
router.post('/monitoring/burner', [userAuthMidelware, cdBurnerMidelware], startBurner)
router.delete('/monitoring/burner', [userAuthMidelware, cdBurnerMidelware], stopBurner)
router.get('/monitoring/burner', [userAuthMidelware, cdBurnerMidelware], getBurner)
router.post('/monitoring/burner/jobs/:jobBurnerId/cancel', [userAuthMidelware, cdBurnerMidelware], cancelJobBurner)
//Autorouter
router.get('/monitoring/autorouter', [userAuthMidelware, autoroutingMidelware], getAutorouter)
router.post('/monitoring/autorouter', [userAuthMidelware, autoroutingMidelware], startAutorouter)
router.delete('/monitoring/autorouter', [userAuthMidelware, autoroutingMidelware], stopAutorouter)

//Server Time
router.get('/tools/time', userAuthMidelware, (req, res) => {
    res.send((new Date()).toLocaleString());
})

//Endpoints and transcoding option
router.get('/endpoints/', [userAuthMidelware], allEndpoints)
router.get('/options/export-transcoding', [userAuthMidelware], getExportTranscoding)

/*
** TASKS
*/

router.use('/tasks', checkForOrthancQueueReady);

//OrthancToolsJS Robot routes
//Retrieve Robot
router.post('/tasks/:username/retrieve', [userAuthMidelware, autoQueryMidelware], addRetrieveTask)

//AnonRobot
router.post('/tasks/:username/anonymize', [userAuthMidelware, anonMidelware], addAnonTask)

//DeleteRobot
//SK BUG MIDELWARE DELETE?
router.post('/tasks/:username/delete', [userAuthMidelware, isCurrentUserOrAdminMidelWare], addDeleteTask)

//FTP & WebDav Exports
router.post('/tasks/:user/export', [userAuthMidelware, exportExternMidelware], addExportTask)

//Tasks
//SK : ICI MANQUE LES MIDDELWARE
router.get('/tasks/:username/:type', userAuthMidelware, getTaskWithUser)
//SK ICI FAUT MUTIPLIER CETTE ROUTE POUR CHAQUE TYPE POUR ASSOCIER LE BON MIDDELWARE
router.delete('/tasks/:username/:type', [userAuthMidelware, isCurrentUserOrAdminMidelWare], deleteTaskOfUser)
router.delete('/tasks/retrieve/:taskId/:itemId', [userAuthMidelware, isCurrentUserOrAdminMidelWare, autoQueryMidelware], deleteRetrieveItem)
router.put('/tasks/retrieve/:taskId/:itemId/retry', [userAuthMidelware, isCurrentUserOrAdminMidelWare, autoQueryMidelware], retryRetrieveItem)
router.get('/tasks/:id', [userAuthMidelware, ownTaskOrIsAdminMidelware], getTask)
router.delete('/tasks/:id', [userAuthMidelware, ownTaskOrIsAdminMidelware], deleteTask)
router.get('/tasks', [userAuthMidelware, userAdminMidelware], getTasksIds)
router.get('/tasks?expend', [userAuthMidelware, userAdminMidelware], getTasks)

module.exports = router