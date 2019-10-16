var Orthanc =require('../model/Orthanc');
let OrthancPatient=require('../model/OrthancPatient');

var orthancInstance=new Orthanc();

var getResults = function(req, res){
    orthancInstance.getSystem(function (orthancSystem){
        console.log(orthancSystem);
        res.render('index',{title :orthancSystem.DicomPort});
    });

    /*
    orthancInstance.exportArchiveDicom(['48a035b8-ad777410-26b3221a-8d706d47-4347feef'], function(answer){
        console.log(answer);
    });
    

    orthancInstance.putPeer("pacs2","gfdgfdgd","localhost",8042,"Generic", function(answer){
        console.log(answer);
    });
    */

   let orthancPatientInstance=new OrthancPatient('082d8674-46f8e91e-5ac7d0ea-07a35046-667ce983', orthancInstance);
   orthancPatientInstance.fillDetails();

   /*
    orthancInstance.buildDicomQuery("Study", "*", "*", "20191015");
    orthancInstance.makeDicomQuery("Xeleris31", function(answer){
        orthancInstance.makeRetrieve(answer[0], 'KANOUNIX', function(answer){
            console.log(answer);

            orthancInstance.findInOrthanc('study', '*', '*', answer.accessionNb, '*','*','*', function(answer){
                console.log(answer[0].ID)

                orthancInstance.exportArchiveDicom([answer[0].ID]);

            });
        });
    });
    */


}

module.exports={getResults};