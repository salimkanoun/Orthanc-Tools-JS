var express = require('express');
var router = express.Router();

var indexController=require('../controllers/index');
var orthancController=require('../controllers/orthanc');
var queryController=require('../controllers/queryAction');
var jobDetailsController=require('../controllers/jobDetails');
var retrieveController=require('../controllers/retrieveDicom');
var exportController=require('../controllers/exportDicom');


//Route request to controllers
router.all('/', indexController.getResults);

router.all('/orthanc', orthancController.getResults);

router.all('/query', queryController.getResults);

router.all('/job_details', jobDetailsController.getResults);

router.all('/retrieve', retrieveController.getResults);

router.all('/export_dicom', exportController.getResults);

module.exports = router;
