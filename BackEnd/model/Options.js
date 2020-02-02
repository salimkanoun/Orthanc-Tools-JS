const db = require('../database/models')
const Orthanc = require('./Orthanc')
const Robot_Singleton = require('./Robot_Singleton')
class Options {
  async getOptions () {
    const option = await db.Option.findOne(({ where: { id: 1 } }))
    return ({ hour: option.hour, min: option.min })
  }

  async setScheduleTime (hour, min) {
    const option = await db.Option.findOne(({ where: { id: 1 } }))
    option.hour = hour
    option.min = min
    await option.save()

    // Refresh time of scheduled job
    // SK A REVOIR
    /*
    const orthanc = new Orthanc()
    const robotSingleton = new Robot_Singleton(orthanc)
    const retrieveRobot = robotSingleton.getRobot()
    retrieveRobot.scheduleRetrieve()
    */
  }
}

module.exports = Options
