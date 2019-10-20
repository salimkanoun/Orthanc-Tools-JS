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

    let orthancPatientInstance = new OrthancPatient('119e9833-fa2a6a26-a7bf262c-c2e4ef43-34ec7d79', orthancInstance);

    let getAllDetails=async function(){

        await orthancPatientInstance.fillDetails();

        await orthancPatientInstance.fillStudiesDetails();
    
        let allSeriesPromises=[];
        orthancPatientInstance.studiesObjects.forEach(study => {
            //console.log(study);
            allSeriesPromises.push(study.fillSeriesDetails());
        });
        await Promise.all(allSeriesPromises);
        console.log('apres await');
        console.log(orthancPatientInstance);

    };
   
    getAllDetails();
  


    /*
    orthancInstance.getPatientWithAllDetails('ecf24f91-9955a86f-e3e529ba-1a7aad33-54e9d9d3', function(orthancPatientInstance){
        console.log(orthancPatientInstance);
    })
    */
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