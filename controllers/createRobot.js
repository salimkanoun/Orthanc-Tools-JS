var getResults = async function (req, res) {
    let Retrieve_Robot = require('../model/Retrieve_Robot')
    let Orthanc = require('../model/Orthanc')
    let Options = require('../model/Options')
    let Database = require('../model/Database')
    let databaseObject=await Database.getDatabase()
    let optionObject=new Options(databaseObject)
    let optionsParameters= await optionObject.getOptions()
    console.log('options param'+optionsParameters)
    const body = req.body
    let orthanc = new Orthanc()
    const orthancSystem = await orthanc.getSystem()
    let retriveRobot=new Retrieve_Robot(orthanc, body.studyArray, orthancSystem.DicomAet)
    retriveRobot.scheduleRetrieve(optionsParameters.hour, optionsParameters.min);

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify('Done'))
}

module.exports = { getResults }