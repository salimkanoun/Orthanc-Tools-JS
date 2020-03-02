const Options = require('../model/Options')
const RobotSingleton = require('../model/RobotSingleton')
const ReverseProxy = require('../model/ReverseProxy')

var changeSchedule = async function (req, res) {
  await Options.setScheduleTime(req.body.hour, req.body.min)
  //Refresh Retrieve Robot to the new time
  const robotSingleton = new RobotSingleton()
  const retrieveRobot = robotSingleton.getRobot()
  retrieveRobot.scheduleRetrieve()
  res.json(true)
}

var getSchedule = async function (req, res) {
  const optionsValues = await Options.getOptions()
  res.json(optionsValues)
}

var getOrthancServer =  function (req, res) {
  let orthancSettings = Options.getOrthancConnexionSettings()
  res.json(orthancSettings)
}

var setOrthancServer =  function (req, res) {
  let data=req.body
  Options.setOrthancConnexionSettings(data.address, data.port, data.username, data.password)
  res.end()
}

var getOrthancSystem = async function (req, res) {
  ReverseProxy.streamToRes('/system', 'GET', undefined, res)
}

module.exports = { changeSchedule, getSchedule, getOrthancServer, setOrthancServer, getOrthancSystem }
