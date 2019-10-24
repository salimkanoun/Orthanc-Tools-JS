var express = require('express');
var router = express.Router();
var Orthanc=require('../model/Orthanc');


var indexController=require('../controllers/orthanc');
var queryController=require('../controllers/queryAction');
var jobDetailsController=require('../controllers/jobDetails');
var retrieveController=require('../controllers/retrieveDicom');
var exportController=require('../controllers/exportDicom');

/* GET home page. */
router.get('/', function(req, res, next) {
});

//Route request to controllers
router.get('/orthanc', indexController.getResults);

router.all('/query', queryController.getResults);

router.all('/job_details', jobDetailsController.getResults);

router.all('/retrieve', retrieveController.getResults);

router.all('/export_dicom', exportController.getResults);

module.exports = router;
