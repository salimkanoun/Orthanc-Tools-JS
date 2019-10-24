var Orthanc =require('../model/Orthanc');

var getResults = async function(req, res){
    let body=req.body;
    var orthancInstance=new Orthanc();

    console.log(body);
    var date = new Date();
    console.log(body.studyUID);
    let orthancID=await orthancInstance.findInOrthancByUid(body.studyUID);
    console.log(orthancID);
    
    await orthancInstance.exportArchiveDicom(orthancID, 'export'+date.getTime());
    let data={};
    data['fileName']='export'+date.getTime()+'.zip';
    
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
};

module.exports={getResults};