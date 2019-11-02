var Orthanc =require('../model/Orthanc');

var orthancInstance=new Orthanc();
   
var getResults = async function(req, res){
    await orthancInstance.putAet('self', 'ORTHANC', 'localhost', 4242, 'Generic');
    let aets=await orthancInstance.getAvailableAet();
    let systemInfo=await orthancInstance.getSystem();
    console.log(systemInfo);
    
    res.render('index', {title : 'Image Fetcher', availableAets : aets });


}

module.exports={getResults};