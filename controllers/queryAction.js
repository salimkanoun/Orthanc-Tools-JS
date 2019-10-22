var Orthanc =require('../model/Orthanc');

var getResults = async function(req, res){
    console.log(req.body);
    var orthancInstance=new Orthanc();
    orthancInstance.buildDicomQuery('study', )
};

module.exports={getResults};