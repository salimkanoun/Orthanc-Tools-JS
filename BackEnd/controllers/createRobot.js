var getResults = async function (req, res) {
  const Robot_Singleton = require('../model/Robot_Singleton')
  const Orthanc = require('../model/Orthanc')
  const Options = require('../model/Options')
  const Database = require('../model/Database')
  const databaseObject = await Database.getDatabase()
  const optionObject = new Options(databaseObject)
  const optionsParameters = await optionObject.getOptions()

  const orthanc = new Orthanc()
  const orthancSystem = await orthanc.getSystem()
  const robotSingleton = new Robot_Singleton(orthanc)
  const retrieveRobot = robotSingleton.getRobot()

  if( req.method === 'GET' ){

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(retrieveRobot.getRetrieveList()))


  }else if(req.method === 'POST'){

    const body = req.body
    retrieveRobot.setRetrieveList(body.studyArray)
    retrieveRobot.setDestination(orthancSystem.DicomAet)
    retrieveRobot.scheduleRetrieve(optionsParameters.hour, optionsParameters.min)

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify('Done'))


  }

 



}

module.exports = { getResults }
