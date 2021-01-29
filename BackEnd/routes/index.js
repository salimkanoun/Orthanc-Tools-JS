var express = require('express')
var router = express.Router()
// Handle controller errors
require('express-async-errors')

const { getParsedAnswer, postRetrieve } = require('../controllers/query')
const { reverseProxyGet, reverseProxyPost, reverseProxyPostUploadDicom, reverseProxyDelete } = require('../controllers/reverseProxy')
const { startBurner, getBurner, stopBurner, cancelJobBurner } = require('../controllers/monitoring')

const { importMidelware, contentMidelware, anonMidelware, exportLocalMidelware,
    exportExternMidelware, queryMidelware, autoQueryMidelware, deleteMidelware, modifyMidelware, isCurrentUserOrAdminMidelWare, userAuthMidelware } = require('../midelwares/authentication')

const { getTask, getTasks, getTasksIds, getTaskWithUser, getTasksOfType, deleteTask, deleteTaskOfUser, addAnonTask, addDeleteTask, addRetrieveTask, validateRetrieve, deleteRetrieveItem, addExportTask } = require('../controllers/task')


router.use(userAuthMidelware)

router.get('/modalities', reverseProxyGet)
router.post('/modalities/*/store', exportLocalMidelware, reverseProxyPost)

// Orthanc Query / Retrieve Routes
router.post('/modalities/:modality/query', queryMidelware, reverseProxyPost)
router.get('/queries/:orthancIdQuery/answers*', queryMidelware, reverseProxyGet)
router.post('/retrieve', queryMidelware, postRetrieve)

// OrthancToolsJS API to get simplified results from Orthanc
router.get('/queries/:orthancIdQuery/parsedAnswers', queryMidelware, getParsedAnswer)

// Orthanc Dicom Import Route
router.post('/instances', importMidelware, reverseProxyPostUploadDicom)

// Orthanc DicomWebRoutes
router.get('/dicom-web/*', contentMidelware, reverseProxyGet)
router.get('/wado/*', contentMidelware, reverseProxyGet)

//Orthanc export routes
router.post('/tools/create-archive', exportLocalMidelware, reverseProxyPost)
router.post('/tools/create-media-extended', exportLocalMidelware, reverseProxyPost)

//Orthanc Peers Routes
router.post('/peers/*/store', exportExternMidelware, reverseProxyPost)

//Orthanc Modify
router.post('/patients/*/modify', modifyMidelware, reverseProxyPost)
router.post('/studies/*/modify', modifyMidelware, reverseProxyPost)
router.post('/series/*/modify', modifyMidelware, reverseProxyPost)

//Orthanc content
router.post('/tools/find', contentMidelware, reverseProxyPost)
router.get('/patients/*', contentMidelware, reverseProxyGet)
router.get('/studies/*', contentMidelware, reverseProxyGet)
router.get('/series/*', contentMidelware, reverseProxyGet)
router.get('/instances/*', contentMidelware, reverseProxyGet)
router.delete('/patients/*', contentMidelware, reverseProxyDelete)
router.delete('/studies/*', contentMidelware, reverseProxyDelete)
router.delete('/series/*', contentMidelware, reverseProxyDelete)

//Monitoring
router.post('/monitoring/burner', startBurner)
router.delete('/monitoring/burner', stopBurner)
router.get('/monitoring/burner', getBurner)
router.post('/monitoring/burner/jobs/:jobBurnerId/cancel', cancelJobBurner)

/*
** TASKS
*/

//OrthancToolsJS Robot routes
//Retrieve Robot
router.post('/robot/:username/retrieve', [isCurrentUserOrAdminMidelWare, autoQueryMidelware], addRetrieveTask)

//AnonRobot
router.post('/robot/:username/anonymize', anonMidelware, addAnonTask)

//DeleteRobot
//SK BUG MIDELWARE DELETE?
router.post('/robot/:username/delete', deleteMidelware, addDeleteTask)

//FTP & WebDav Exports
router.post('/robot/:user/export', exportExternMidelware, addExportTask)

//Tasks
//SK : ICI MANQUE LES MIDDELWARE
router.get('/tasks/:username/:type', getTaskWithUser)
router.delete('/tasks/:username/:type', deleteTaskOfUser)
router.delete('/tasks/:username/retrieve/:id', deleteRetrieveItem)
router.get('/tasks/:id', getTask)
router.delete('/tasks/:id', deleteTask)
router.get('/tasks', getTasksIds)
router.get('/tasks?expend', getTasks)

module.exports = router