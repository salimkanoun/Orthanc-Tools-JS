var express = require('express');
var router = express.Router();
var Orthanc=require('../model/Orthanc');


var orthancController=require('../controllers/orthanc');

/* GET home page. */
router.get('/', function(req, res, next) {
  new Orthanc();
  res.render('index', { title: 'Express' });
});

//Route request to controllers
router.get('/orthanc', orthancController.getResults);

module.exports = router;
