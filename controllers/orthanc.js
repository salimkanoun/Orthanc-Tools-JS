var Orthanc =require('../model/Orthanc');

var orthancInstance=new Orthanc();

var getResults = function(req, res){
    orthancInstance.getSystem(function (orthancSystem){
        console.log(orthancSystem);
        res.render('index',{title :orthancSystem.DicomPort});
    });

    
    orthancInstance.getArchiveDicom(['c7972902-3aa31e0c-ca7b2c78-4aa358d7-8e3f85a0'], function(answer){
        console.log(answer);
    });
    

    orthancInstance.putPeer("pacs2","gfdgfdgd","localhost",8042,"Generic", function(answer){
        console.log(answer);
    });

    orthancInstance.buildDicomQuery("Study", "*", "*", "20191015");
    orthancInstance.makeDicomQuery("Xeleris31", function(answer){
        console.log(answer)
    });



}

module.exports={getResults};