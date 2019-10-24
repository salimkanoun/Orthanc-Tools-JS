var Orthanc =require('../model/Orthanc');

var getResults = async function(req, res){
    let body=req.body;
    var orthancInstance=new Orthanc();

    console.log(body);
    let jobData= await orthancInstance.getJobData(body.jobUid);
    
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(jobData));
};

module.exports={getResults};