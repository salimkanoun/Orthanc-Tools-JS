var Orthanc =require('../model/Orthanc');
let OrthancPatient=require('../model/OrthancPatient');

var orthancInstance=new Orthanc();
   
var getResults = async function(req, res){
    
    let aets=await orthancInstance.getAvailableAet();
    console.log(aets);
    let systemInfo=await orthancInstance.getSystem();
    console.log(systemInfo);

    await orthancInstance.putAet("OrthancSelf","Orthanc","localhost",4242,"Generic");
    console.log(aets);
    res.render('index', {title : 'Image Fetcher', availableAets : aets });

    //orthancInstance.makeAnon('studies', '871a6d1f-faa16eeb-9daeae3e-7c78b393-e925978c', 'Default', 'access', 'id', 'name', 'desc');

    //orthancInstance.deleteFromOrhtanc('studies', 'd0dd07ba-8cc16fb7-84633638-327a8f93-4190a2d6');

    //orthancInstance.exportArchiveDicom(['119e9833-fa2a6a26-a7bf262c-c2e4ef43-34ec7d79'], 'exportDicom');
    
    //let orthancPatientInstance = new OrthancPatient('119e9833-fa2a6a26-a7bf262c-c2e4ef43-34ec7d79', orthancInstance);
    /*
    async function showDetails(){
        await orthancPatientInstance.fillAllChildsDetails();
        console.log(orthancPatientInstance);
        orthancPatientInstance.studiesObjects.forEach(study => {
            console.log(study);
            study.Series.forEach(serie=>{
                console.log(serie);
            });
        });

    } 

    showDetails();
    */

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