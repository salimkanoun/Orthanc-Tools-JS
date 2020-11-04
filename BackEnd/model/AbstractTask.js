const uuid = require("../utils/uuid")

class AbstractTask{
    constructor(){
        this.id = uuid.getUuid()
        AbstractTask.taskIndex[this.id] = this
    }

    async run(){
        throw typeof(this)+":run() Not Implemented"
    }
    
    async getProgress(){
        throw typeof(this)+":getProgress() : Not Implemented"
    }

    async getState(){
        throw typeof(this)+":getState() :  Not Implemented"
    }
}

AbstractTask.taskIndex = {}

module.exports = AbstractTask