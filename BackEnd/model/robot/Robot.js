const Job = require('./Job') 

class Robot {

    jobs = { }

    addJob(jobObject){
        if( this.jobs[jobObject.username] === undefined ) {
            this.jobs[jobObject.username] = { }
        }
        this.jobs[jobObject.username][jobObject.type] = jobObject
    }

    getRetrieveJobs(){
        let jobObjects = {}
        for(let username in this.jobs){
            for(let type in this.jobs[username]){
                if (type == Job.TYPE_RETRIEVE ){
                    jobObjects[username] = this.jobs[username][type]
                }
            }
        }
        return jobObjects
    }

    getJob(username, type){
        try{
            let job = this.jobs[username][type]
            return job
        }catch (error) {
            return undefined
        }

    }

    removeJob(username, type){
        delete this.jobs[username][type]
    }

    
    

}

const robot = new Robot();
Object.freeze(robot);

exports.robot = robot
exports.Robot = Robot
