const Robot = require('./Retrieve_Robot')

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
