var getResults = async function (req, res) {
  // SK ICI ROBOT NECESSITE D ETRE UNIQUE POUR TOUT L APPLI
  const Robot_Singleton = require('../model/Robot_Singleton')
  const Orthanc = require('../model/Orthanc')
  const Options = require('../model/Options')
  const Database = require('../model/Database')
  const databaseObject = await Database.getDatabase()
  const optionObject = new Options(databaseObject)
  const optionsParameters = await optionObject.getOptions()
  console.log('options param' + optionsParameters)
  const body = req.body
  const orthanc = new Orthanc()
  const orthancSystem = await orthanc.getSystem()
  const robotSingleton = new Robot_Singleton(orthanc)
  retrieveRobot = robotSingleton.getRobot()
  retrieveRobot.setRetrieveList(body.studyArray)
  retrieveRobot.setDestination(orthancSystem.DicomAet)
  retrieveRobot.scheduleRetrieve(optionsParameters.hour, optionsParameters.min)

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify('Done'))
}

module.exports = { getResults }
