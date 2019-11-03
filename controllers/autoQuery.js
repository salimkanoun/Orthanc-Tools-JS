var Orthanc =require('../model/Orthanc');

var orthancInstance=new Orthanc();
   
var getResults = async function(req, res){
    await orthancInstance.putAet('self', 'ORTHANC', 'localhost', 4242, 'Generic');
    let aets=await orthancInstance.getAvailableAet();
    let orthancSystem=await orthancInstance.getSystem();
    
    res.render('autoQuery', {title : 'Image Fetcher', availableAets : aets, orthancInfo: orthancSystem});


}

module.exports={getResults};