const schedule = require('node-schedule')
const Options = require('./Options')
const RetrieveItem = require('./RetrieveItem')

class RetrieveRobot {
  constructor (orthancObject) {
    this.orthancObject = orthancObject
    this.robotJobs = []
  }

  async getScheduleTimeFromOptions () {
    const optionsParameters = await Options.getOptions()
    return {
      hour: optionsParameters.hour,
      min: optionsParameters.min
    }
  }

  /**
   * Add RobotJob
   * @param {String} username
   * @param {RobotJob} robotJob
   */
  addRobotJob (robotJob) {
    this.robotJobs[robotJob.username] = robotJob
  }

  removeRobotJob (username) {
    delete this.robotJobs[username]
  }

  /**
   * Destination of retrieval for this retrive robot
   * @param {String} aetDestination
   */
  setDestination (aetDestination) {
    console.log('set destination ' + aetDestination)
    this.aetDestination = aetDestination
  }

  /**
   * SK ICI RECUPERATION DES DATA DU ROBOT POUR USERNAME OU GLOBAL
   * @param {String} username
   */
  getRobotData (username) {
    const robotJob = this.robotJobs[username]
    return robotJob.toJSON()
  }

  getAllRobotData () {
    const responseArray = []
    const currentRobot = this
    Object.keys(this.robotJobs).forEach(function (username, index) {
      const dataJob = JSON.stringify(currentRobot.getRobotData(username))
      responseArray.push(JSON.parse(dataJob))
    })

    return responseArray
  }

  async scheduleRetrieve () {
    const robot = this

    console.log(this.scheduledJob)

    if (this.scheduledJob !== undefined) {
      console.log('Cancelled previous job')
      this.scheduledJob.cancel()
    }

    // SK N'est pas au bon endroit, ne sera pas mis a jour si modification de l'heure apres decalaration du robot
    this.scheduleTime = await this.getScheduleTimeFromOptions()

    const scheduledJob = schedule.scheduleJob(this.scheduleTime.min + ' ' + this.scheduleTime.hour + ' * * *', function () {
      console.log('Scheduled Retrieve Started')
      robot.doRetrieve()
    })

    this.scheduledJob = scheduledJob

    console.log(scheduledJob)
  }

  async doRetrieve () {
    const robot = this
    console.log(this.robotJobs)
    const usersRobots = Object.keys(this.robotJobs)

    for (let i = 0; i < usersRobots.length; i++) {
      const job = this.robotJobs[usersRobots[i]]

      for (let i = 0; i < job.retrieveList.length; i++) {
        const retrieveItem = job.getRetriveItem(i)
        console.log(retrieveItem)

        robot.orthancObject.buildDicomQuery(retrieveItem.level, retrieveItem.patientName, retrieveItem.patientId, retrieveItem.studyDate + '-' + retrieveItem.studyDate,
        retrieveItem.modality, retrieveItem.studyDescription, retrieveItem.accessionNb)

        job.getRetriveItem(i).setStatus(RetrieveItem.STATUS_RETRIVING)
        const answerDetails = await robot.orthancObject.makeDicomQuery(retrieveItem.aet)

        if (answerDetails.length === 1 ) {
          let answer = answerDetails[0]
          const retrieveAnswer = await robot.orthancObject.makeRetrieve(answer.answerId, answer.answerNumber, robot.aetDestination, true)
          const orthancResults = await robot.orthancObject.findInOrthancByUid(retrieveAnswer.Query[0]['0020,000d'])

          if(orthancResults.length === 1){
            job.getRetriveItem(i).setStatus(RetrieveItem.STATUS_RETRIEVED)
            job.getRetriveItem(i).setRetrievedOrthancId(orthancResults[0])
          }else{
            job.getRetriveItem(i).setStatus(RetrieveItem.STATUS_FAILURE)
          }
          
        }
      }
    }

    // If wanted do Anonymization

    await this.exportDicom()
  }

  // SK A FAIRE
  anonymizeDicom () {

  }

  async exportDicom () {
    const retrieveRobot = this
    console.log(this.robotJobs)
    const usersRobots = Object.keys(this.robotJobs)

    for (let i = 0; i < usersRobots.length; i++) {
      const job = this.robotJobs[usersRobots[i]]
      const retrievedOrthancIds = job.getRetrievedOrthancId()
      console.log(retrievedOrthancIds)
      retrieveRobot.orthancObject.exportArchiveDicom(retrievedOrthancIds, job.username + '_' + job.projectName)
    }
  }
}

module.exports = RetrieveRobot
