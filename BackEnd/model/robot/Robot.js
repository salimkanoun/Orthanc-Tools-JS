class RobotSingleton {

  constructor () {
    if (!RobotSingleton.instance) {
        RobotSingleton.instance = new Robot()
    }
  }

  getRobot () {
    return RobotSingleton.instance
  }

}

class Robot {

    jobs = { }

    addJob(jobObject){
        if( this.jobs[jobObject.username] === undefined ) {
            this.jobs[jobObject.username] = { }
        }
        this.jobs[jobObject.username][jobObject.type] = jobObject
    }

    getJob(username, type){
        return this.job[username][type]

    }

    removeJob(username, type){
        delete this.job[username][type]
    }

}



module.exports = RobotSingleton
