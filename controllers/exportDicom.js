var Orthanc =require('../model/Orthanc');

var getResults = async function(req, res){
    let body=req.body;
    var orthancInstance=new Orthanc();

    console.log(body);
    var date = new Date();
    let orthancID=await orthancInstance.findInOrthanc('Study', body.studyUID);
    console.log(orthancID);
    let data={};
    await orthancInstance.exportArchiveDicom(body.orthancIds, 'export'+date.getTime());
    data['fileName']='export'+date.getTime()+'.zip';
    
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
};

module.exports={getResults};