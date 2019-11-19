var getResults = async function (req, res) {
  const Retrieve_Robot = require('../model/Retrieve_Robot')
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
  const retriveRobot = new Retrieve_Robot(orthanc, body.studyArray, orthancSystem.DicomAet)
  retriveRobot.scheduleRetrieve(optionsParameters.hour, optionsParameters.min)

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify('Done'))
}

module.exports = { getResults }
