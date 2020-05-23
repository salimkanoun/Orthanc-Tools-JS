const schedule = require('node-schedule')
const Options = require('./Options')
const RetrieveItem = require('./RetrieveItem')

class RetrieveRobot {

  constructor (orthancObject) {
    this.orthancObject = orthancObject
    this.robotJobs = []
    this.status = RetrieveItem.STATUS_IDLE
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
  async setDestination (aetDestination = undefined) {
    if (aetDestination === undefined) {
      const orthancAetName = await this.orthancObject.getOrthancAetName()
      this.aetDestination = orthancAetName
    } else {
      this.aetDestination = aetDestination
    }
  }

  getRobotData (username) {
    const robotJob = this.robotJobs[username]
    if(robotJob !== undefined){
      return robotJob.toJSON()
    }else{
      throw('No Robot for User')
    }
  }

  getAllRobotData () {
    const responseArray = []
    const currentRobot = this
    Object.keys(this.robotJobs).forEach(function (username, index) {
      responseArray.push(currentRobot.getRobotData(username))
    })

    return responseArray
  }

  async scheduleRetrieve () {
    const robot = this

    if (this.scheduledJob !== undefined) {
      this.scheduledJob.cancel()
    }

    this.scheduleTime = await this.getScheduleTimeFromOptions()

    const scheduledJob = schedule.scheduleJob(this.scheduleTime.min + ' ' + this.scheduleTime.hour + ' * * *', function () {
      robot.doRetrieve()
    })

    this.scheduledJob = scheduledJob
  }

  /**
   * Make queries prior to robot execution
   * Check that each query return only one answer (study or serie)
   * Store number of instance in each query
   * Set RobotJob as validated to be processed
   * @param {*} username
   */
  async validateRobotJob (username) {
    const robotJob = this.robotJobs[username]

    if (!robotJob.isValidated()) {
      await robotJob.validate(this.orthancObject)
    }

  }


  async doRetrieve () {
    const usersRobots = Object.keys(this.robotJobs)

    this.status = RetrieveItem.STATUS_RETRIVING

    for (let i = 0; i < usersRobots.length; i++) {
      const job = this.robotJobs[usersRobots[i]]
      if (job.isValidated()) {
        await job.retrieveJob()
      }

    }

    this.status = RetrieveItem.STATUS_RETRIEVED

  }

  toJSON () {
    return {
      status: this.status
    }
  }

}

module.exports = RetrieveRobot
