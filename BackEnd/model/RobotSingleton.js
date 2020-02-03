const Robot = require('./RetrieveRobot')

class RobotSingleton {
  constructor (orthancObject) {
    if (!RobotSingleton.instance) {
      RobotSingleton.instance = new Robot(orthancObject)
    }
  }

  getRobot () {
    return RobotSingleton.instance
  }
}

module.exports = RobotSingleton
