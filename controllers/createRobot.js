var getResults = async function (req, res) {
    //SK ICI ROBOT NECESSITE D ETRE UNIQUE POUR TOUT L APPLI
    let Robot_Singleton = require('../model/Robot_Singleton')
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
    let robotSingleton=new Robot_Singleton(orthanc)
    retrieveRobot=robotSingleton.getRobot()
    retrieveRobot.setRetrieveList(body.studyArray)
    retrieveRobot.setDestination(orthancSystem.DicomAet)
    retrieveRobot.scheduleRetrieve(optionsParameters.hour, optionsParameters.min);

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify('Done'))
}

module.exports = { getResults }