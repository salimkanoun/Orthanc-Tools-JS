const Robot = require('./RetrieveRobot')
const Orthanc = require('./Orthanc')

class RobotSingleton {

  constructor () {
    if (!RobotSingleton.instance) {
      RobotSingleton.instance = new Robot(new Orthanc())
    }
  }

  getRobot () {
    return RobotSingleton.instance
  }

}

module.exports = RobotSingleton
