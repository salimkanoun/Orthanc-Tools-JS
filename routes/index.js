var express = require('express');
var router = express.Router();
var Orthanc=require('../model/Orthanc');


var indexController=require('../controllers/orthanc');
var queryController=require('../controllers/queryAction');

/* GET home page. */
router.get('/', function(req, res, next) {
});

//Route request to controllers
router.get('/orthanc', indexController.getResults);

router.all('/query', queryController.getResults);

module.exports = router;
