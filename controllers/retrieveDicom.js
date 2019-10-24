var Orthanc =require('../model/Orthanc');

var getResults = async function(req, res){
    let body=req.body;
    var orthancInstance=new Orthanc();
    let systemInfo=await orthancInstance.getSystem();
    console.log(body);
    let jobID= await orthancInstance.makeRetrieve(body.queryID, body.answerNumber, systemInfo.DicomAet);
    
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(jobID));
};

module.exports={getResults};