const RobotSingleton = require('../model/Robot_Singleton')
const Robot_Job = require('../model/Robot_Job')
const Orthanc = require('../model/Orthanc')

var getResults = async function (req, res) {

  const orthanc = new Orthanc()
  const robotSingleton = new RobotSingleton(orthanc)
  const retrieveRobot = robotSingleton.getRobot()

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json')
    //SK A FAIRE
    console.log(Object.values(retrieveRobot.getRobotData()))
    res.end(JSON.stringify(retrieveRobot.getRobotData()))

  } else if (req.method === 'POST') {

    const body = req.body
    //SK passer Username en variable
    let robotJob=new Robot_Job('salim', body.projectName);

    body.studyArray.forEach((retrieveQuery) => {
      robotJob.addRetrieveItem('study', retrieveQuery.patientName, retrieveQuery.patientID, retrieveQuery.studyDate, retrieveQuery.modality, retrieveQuery.studyDescription, retrieveQuery.accessionNb)
    })
    
    retrieveRobot.addRobotJob(robotJob)
    retrieveRobot.scheduleRetrieve()

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify('Done'))
  }
}

module.exports = { getResults }
