const RetrieveRobot = require('./Retrieve_Robot')

class RobotSingleton {
  constructor (orthancObject) {
    if (!RobotSingleton.instance) {
      RobotSingleton.instance = new RetrieveRobot(orthancObject)
    }
  }

  getRobot () {
    return RobotSingleton.instance
  }
}

module.exports = RobotSingleton
