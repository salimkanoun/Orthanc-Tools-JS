class Robot {

    jobs = { }

    addJob(jobObject){
        if( this.jobs[jobObject.username] === undefined ) {
            this.jobs[jobObject.username] = { }
        }
        this.jobs[jobObject.username][jobObject.type] = jobObject
    }

    getJob(username, type){
        return this.jobs[username][type]

    }

    removeJob(username, type){
        delete this.jobs[username][type]
    }

    
    

}

const robot = new Robot();
Object.freeze(robot);

exports.robot = robot
exports.Robot = Robot
