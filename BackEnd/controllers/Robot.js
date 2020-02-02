const Robot_Singleton = require('../model/Robot_Singleton')
const Robot_Job = require('../model/Robot_Job')
const Orthanc = require('../model/Orthanc')

const getRobotDetails = async function (req, res) {
  const orthanc = new Orthanc()
  const robotSingleton = new Robot_Singleton(orthanc)
  const retrieveRobot = robotSingleton.getRobot()
  let data = null
  if (req.params.username !== undefined) {
    data = retrieveRobot.getRobotData(req.params.username)
  } else {
    data = retrieveRobot.getAllRobotData()
  }

  console.log(data)
  res.json(data)
}

const createRobot = async function (req, res) {
  const orthanc = new Orthanc()
  const robotSingleton = new Robot_Singleton(orthanc)
  const retrieveRobot = robotSingleton.getRobot()

  const body = req.body
  // SK passer Username en variable
  const robotJob = new Robot_Job(req.session.username, body.projectName)

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

module.exports = { createRobot, getRobotDetails }
