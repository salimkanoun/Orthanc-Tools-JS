const schedule = require('node-schedule')

class Retrieve_Robot {
  constructor (orthancObject, retrieveList, aetDestination) {
    this.orthancObject = orthancObject
    this.retrieveList = retrieveList
    this.aetDestination = aetDestination
  }

  scheduleRetrieve (hour, min) {
    const robot = this
    schedule.scheduleJob(min + hour + ' * * *', function () {
      console.log('Scheduled Retrieve Started')
      robot.doRetrieve()
    })
  }

  async doRetrieve () {
    const robot = this
    const studyInstancUIDRetrieve = []
    console.log(robot.retrieveList)
    for (let i = 0; i < robot.retrieveList.length; i++) {
      const studyData = robot.retrieveList[i]
      console.log(studyData)

      robot.orthancObject.buildDicomQuery('Study', studyData.patientName, studyData.patientID, studyData.studyDate + '-' + studyData.studyDate,
        studyData.modality, studyData.studyDescription, studyData.accessionNb)
      const answerDetails = await robot.orthancObject.makeDicomQuery(studyData.aet)

      for (const answer of answerDetails) {
        const retrieveAnswer = await robot.orthancObject.makeRetrieve(answer.answerId, answer.answerNumber, robot.aetDestination, true)
        console.log(retrieveAnswer)
        studyInstancUIDRetrieve.push(answer.studyInstanceUID)
      }
    }

    this.exportZips(studyInstancUIDRetrieve)
  }

  async exportZips (studyInstancUIDArray) {
    const retrieveRobot = this
    const orthancStudyID = []
    for (let i = 0; i < studyInstancUIDArray.length; i++) {
      const orthancResults = await retrieveRobot.orthancObject.findInOrthancByUid(studyInstancUIDArray[i])
      orthancStudyID.push(orthancResults[0])
    }

    this.orthancObject.exportArchiveDicom(orthancStudyID, 'resultRobot')
  }
}

module.exports = Retrieve_Robot
