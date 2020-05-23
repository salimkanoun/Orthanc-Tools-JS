const RobotSingleton = require('../model/RobotSingleton')
const RobotJob = require('../model/RobotJob')

const getRobotDetails = async function (req, res) {
  const robotSingleton = new RobotSingleton()
  const retrieveRobot = robotSingleton.getRobot()
  try{
    let data = retrieveRobot.getRobotData(req.params.username)
    res.json(data)
  }catch(error){
    res.json({
      retrieveList : []
    })
  }

}

const getAllRobotDetails = async function (req, res){
  const robotSingleton = new RobotSingleton()
  const retrieveRobot = robotSingleton.getRobot()
  let data = retrieveRobot.getAllRobotData()
  res.json(data)
}

const removeQueryFromJob = async function (req, res) {
  const robotSingleton = new RobotSingleton()
  const retrieveRobot = robotSingleton.getRobot()
  if (req.params.username !== undefined) {
    retrieveRobot.robotJobs[req.params.username].removeRetrieveItem(req.params.index)
  }
  res.json(retrieveRobot.getRobotData(req.params.username))
}

const deleteRobotJob = async function (req, res) {
  const robotSingleton = new RobotSingleton()
  const retrieveRobot = robotSingleton.getRobot()
  retrieveRobot.removeRobotJob(req.params.username)
  res.end()
}

const validateRobotJob = async function (req, res) {
  const robotSingleton = new RobotSingleton()
  const retrieveRobot = robotSingleton.getRobot()
  retrieveRobot.validateRobotJob(req.params.username)
  res.json('Finished')
}

const addRobotJob = async function (req, res) {
  const robotSingleton = new RobotSingleton()
  const retrieveRobot = robotSingleton.getRobot()

  const body = req.body
  const robotJob = new RobotJob(req.session.username, body.projectName)

  body.studyArray.forEach((retrieveQuery) => {
    robotJob.addRetrieveItem(retrieveQuery)
  })

  retrieveRobot.addRobotJob(robotJob)
  retrieveRobot.setDestination()
  retrieveRobot.scheduleRetrieve()

  res.json('Done')
}

module.exports = { addRobotJob, getRobotDetails, getAllRobotDetails, deleteRobotJob, removeQueryFromJob, validateRobotJob }
