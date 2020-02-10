const RobotSingleton = require('../model/RobotSingleton')
const RobotJob = require('../model/RobotJob')
const Orthanc = require('../model/Orthanc')

const getRobotDetails = async function (req, res) {
  const orthanc = new Orthanc()
  const robotSingleton = new RobotSingleton(orthanc)
  const retrieveRobot = robotSingleton.getRobot()
  let data = []
  if (req.params.username !== undefined) {
    data = retrieveRobot.getRobotData(req.params.username)
  }else{
    data = retrieveRobot.getAllRobotData()
  }
  console.log(data)
  res.json(data)
}

const deleteRobotJob = async function (req, res){
  const orthanc = new Orthanc()
  const robotSingleton = new RobotSingleton(orthanc)
  const retrieveRobot = robotSingleton.getRobot()
  retrieveRobot.removeRobotJob(req.params.username)
  res.end()
}

const createRobot = async function (req, res) {
  const orthanc = new Orthanc()
  const robotSingleton = new RobotSingleton(orthanc)
  const retrieveRobot = robotSingleton.getRobot()

  const body = req.body
  // SK passer Username en variable
  const robotJob = new RobotJob(req.session.username, body.projectName)

  body.studyArray.forEach((retrieveQuery) => {
    robotJob.addRetrieveItem('study', retrieveQuery.patientName, retrieveQuery.patientID, retrieveQuery.studyDate, retrieveQuery.modality, retrieveQuery.studyDescription, retrieveQuery.accessionNb, retrieveQuery.aet)
  })

  retrieveRobot.addRobotJob(robotJob)
  const orthancSystem = await orthanc.getSystem()
  console.log(orthancSystem)
  retrieveRobot.setDestination(orthancSystem.DicomAet)
  retrieveRobot.scheduleRetrieve()

  res.json('Done')
}

module.exports = { createRobot, getRobotDetails, deleteRobotJob }
