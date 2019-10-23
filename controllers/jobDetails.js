var Orthanc =require('../model/Orthanc');

var getResults = async function(req, res){
    let body=req.body;
    var orthancInstance=new Orthanc();

    console.log(body);
    orthancInstance.getJobData(body.jobUid, body.answserId, body.aet);
    //sk to do
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(queryAnswer));
};

module.exports={getResults};