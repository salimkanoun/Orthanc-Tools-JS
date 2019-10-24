var Orthanc =require('../model/Orthanc');
let OrthancPatient=require('../model/OrthancPatient');

var orthancInstance=new Orthanc();
   
var getResults = async function(req, res){
    
    let aets=await orthancInstance.getAvailableAet();
    let systemInfo=await orthancInstance.getSystem();
    console.log(systemInfo);
    
    res.render('index', {title : 'Image Fetcher', availableAets : aets });


}

module.exports={getResults};