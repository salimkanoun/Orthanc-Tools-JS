const schedule = require('node-schedule')
const Robot_Job = require('./Robot_Job')
const Options = require('./Options')

class Retrieve_Robot {

  constructor (orthancObject) {
    this.orthancObject = orthancObject
    this.robotJobs = []
    this.aetDestination = orthancObject.getSystem().DicomAet

  }

  async getScheduleTimeFromOptions(){
    const optionObject = new Options()
    const optionsParameters = await optionObject.getOptions()
    return{
      hour : optionsParameters.hour, 
      min : optionsParameters.min
    }
  }

  /**
   * Add RobotJob
   * @param {String} username 
   * @param {Robot_Job} robotJob 
   */
  addRobotJob(robotJob){
    this.robotJobs[robotJob.username] = robotJob
  }

  /**
   * Destination of retrieval for this retrive robot
   * @param {String} aetDestination 
   */
  setDestination (aetDestination) {
    this.aetDestination = aetDestination
  }

  /**
   * SK ICI RECUPERATION DES DATA DU ROBOT POUR USERNAME OU GLOBAL
   * @param {String} username 
   */
  getRobotData (username) {
    let robotJob=this.robotJobs[username]
    return robotJob.toJSON()
  }

  getAllRobotData(){
    let responseArray=[]
    let currentRobot=this;
    Object.keys(this.robotJobs).forEach(function(username, index) {
      let dataJob=JSON.stringify(currentRobot.getRobotData(username))
      responseArray.push(JSON.parse(dataJob))
    });

    return responseArray

  }

  async scheduleRetrieve ( ) {
    const robot = this

    console.log(this.scheduledJob)

    if (this.scheduledJob !== undefined) {
      console.log('Cancelled previous job')
      this.scheduledJob.cancel()
    }

    //SK N'est pas au bon endroit, ne sera pas mis a jour si modification de l'heure apres decalaration du robot
    this.scheduleTime = await this.getScheduleTimeFromOptions();
    
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
    let usersRobots = Object.keys(this.robotJobs)

    for (let i = 0; i < usersRobots.length; i++){

      let job=this.robotJobs[usersRobots[i]]

      for (let i = 0; i < job.retrieveList.length; i++) {
        let studyData = job.retrieveList[i]
        console.log(studyData)
  
        robot.orthancObject.buildDicomQuery('Study', studyData.patientName, studyData.patientId, studyData.studyDate + '-' + studyData.studyDate,
          studyData.modality, studyData.studyDescription, studyData.accessionNb)
        
        let answerDetails = await robot.orthancObject.makeDicomQuery(studyData.aet)
  
        for (let answer of answerDetails) {
          let retrieveAnswer = await robot.orthancObject.makeRetrieve(answer.answerId, answer.answerNumber, robot.aetDestination, true)
          console.log(retrieveAnswer)
          let orthancResults = await robot.orthancObject.findInOrthancByUid(retrieveAnswer.studyInstanceUID)
          job.getRetriveItem(i).setRetrievedOrthancId(orthancResults[0])

        }
      }

    }

    //If wanted do Anonymization

    this.exportDicom()
    
  }

  //SK A FAIRE
  anonymizeDicom(){

  }

  async exportDicom(){

    const retrieveRobot = this

    for (let i = 0; i < this.robotJobs.length; i++) {
        let job = this.robotJobs[i]
        let retrievedOrthancId= job.getRetrievedOrthancId()
        await retrieveRobot.orthancObject.exportArchiveDicom(retrievedOrthancId, job.username+'_'+job.projectName)

    }

  }


}

module.exports = Retrieve_Robot
