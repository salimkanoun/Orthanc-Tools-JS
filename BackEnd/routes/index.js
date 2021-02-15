var express = require('express')
var router = express.Router()
// Handle controller errors
require('express-async-errors')

const { getParsedAnswer, postRetrieve } = require('../controllers/queryRetrieve')
const { reverseProxyGet, reverseProxyPost, reverseProxyPostUploadDicom, reverseProxyDelete } = require('../controllers/reverseProxy')
const { startBurner, getBurner, stopBurner, cancelJobBurner } = require('../controllers/monitoring')

const { importMidelware, contentMidelware, anonMidelware, exportLocalMidelware,
        exportExternMidelware, queryMidelware, autoQueryMidelware, deleteMidelware, 
        modifyMidelware,cdBurnerMidelware, isCurrentUserOrAdminMidelWare, userAuthMidelware, userAdminMidelware, ownTaskOrIsAdminMidelware } = require('../midelwares/authentication')


const { getTask, getTasks, getTasksIds, getTaskWithUser, getTasksOfType, deleteTask, deleteTaskOfUser, addAnonTask, addDeleteTask, addRetrieveTask, deleteRetrieveItem, addExportTask } = require('../controllers/task')


router.get('/modalities', userAuthMidelware, reverseProxyGet)
router.post('/modalities/*/store', [userAuthMidelware, exportLocalMidelware], reverseProxyPost)

// Orthanc Query / Retrieve Routes
router.post('/modalities/:modality/query', [userAuthMidelware, queryMidelware], reverseProxyPost)
router.get('/queries/:orthancIdQuery/answers*', [userAuthMidelware, queryMidelware], reverseProxyGet)
router.post('/retrieve', [userAuthMidelware,queryMidelware], postRetrieve)

// OrthancToolsJS API to get simplified results from Orthanc
router.get('/queries/:orthancIdQuery/parsedAnswers', [userAuthMidelware,queryMidelware], getParsedAnswer)

// Orthanc Dicom Import Route
router.post('/instances', [userAuthMidelware,importMidelware], reverseProxyPostUploadDicom)

// Orthanc DicomWebRoutes
router.get('/dicom-web/*', [userAuthMidelware, contentMidelware], reverseProxyGet)
router.get('/wado/*', [userAuthMidelware, contentMidelware], reverseProxyGet)

//Orthanc export routes
router.post('/tools/create-archive', [userAuthMidelware, exportLocalMidelware], reverseProxyPost)
router.post('/tools/create-media-extended', [userAuthMidelware,exportLocalMidelware], reverseProxyPost)

//Orthanc Peers Routes
router.post('/peers/*/store', [userAuthMidelware,exportExternMidelware], reverseProxyPost)

//Orthanc Modify
router.post('/patients/*/modify', [userAuthMidelware,modifyMidelware], reverseProxyPost)
router.post('/studies/*/modify', [userAuthMidelware,modifyMidelware], reverseProxyPost)
router.post('/series/*/modify', [userAuthMidelware,modifyMidelware], reverseProxyPost)

//Orthanc content
router.post('/tools/find', [userAuthMidelware,contentMidelware], reverseProxyPost)
router.get('/patients/*', [userAuthMidelware,contentMidelware], reverseProxyGet)
router.get('/studies/*', [userAuthMidelware,contentMidelware], reverseProxyGet)
router.get('/series/*', [userAuthMidelware,contentMidelware], reverseProxyGet)
router.get('/instances/*', [userAuthMidelware,contentMidelware], reverseProxyGet)
router.delete('/patients/*', [userAuthMidelware,contentMidelware], reverseProxyDelete)
router.delete('/studies/*', [userAuthMidelware,contentMidelware], reverseProxyDelete)
router.delete('/series/*', [userAuthMidelware,contentMidelware], reverseProxyDelete)

//Monitoring
router.post('/monitoring/burner', [userAuthMidelware,cdBurnerMidelware], startBurner)
router.delete('/monitoring/burner', [userAuthMidelware,cdBurnerMidelware], stopBurner)
router.get('/monitoring/burner', [userAuthMidelware,cdBurnerMidelware], getBurner)
router.post('/monitoring/burner/jobs/:jobBurnerId/cancel', [userAuthMidelware,cdBurnerMidelware], cancelJobBurner)

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
router.post('/tasks/:username/delete', [userAuthMidelware, deleteMidelware], addDeleteTask)

//FTP & WebDav Exports
router.post('/tasks/:user/export', [userAuthMidelware, exportExternMidelware], addExportTask)

//Tasks
//SK : ICI MANQUE LES MIDDELWARE
router.get('/tasks/:username/:type', userAuthMidelware, getTaskWithUser)
//SK ICI FAUT MUTIPLIER CETTE ROUTE POUR CHAQUE TYPE POUR ASSOCIER LE BON MIDDELWARE
router.delete('/tasks/:username/:type', [userAuthMidelware, isCurrentUserOrAdminMidelWare], deleteTaskOfUser)
router.delete('/tasks/:username/retrieve/:id', [userAuthMidelware, isCurrentUserOrAdminMidelWare, autoQueryMidelware], deleteRetrieveItem)
router.get('/tasks/:id', [userAuthMidelware, ownTaskOrIsAdminMidelware], getTask)
router.delete('/tasks/:id', [userAuthMidelware,ownTaskOrIsAdminMidelware], deleteTask)
router.get('/tasks', [userAuthMidelware,userAdminMidelware],  getTasksIds)
router.get('/tasks?expend', [userAuthMidelware,userAdminMidelware], getTasks)

module.exports = router