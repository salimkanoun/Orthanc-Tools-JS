var Orthanc =require('../model/Orthanc');

var getResults = async function(req, res){
    console.log(req.body);
    let body=req.body;
    var orthancInstance=new Orthanc();

    console.log(body);
    orthancInstance.buildDicomQuery('Study', body.patientName, body.patientID, body.date, body.modality,
     body.studyDescription, body.accessionNumber );
    let queryAnswer =await orthancInstance.makeDicomQuery(body.aet);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(queryAnswer));
};

module.exports={getResults};