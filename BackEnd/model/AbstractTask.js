const uuid = require("../utils/uuid")

class AbstractTask{
    constructor(){
        this.id = uuid.getUuid()
        AbstractTask.taskIndex[this.id] = this
    }

    async run(){
        throw "Not Implemented"
    }
    
    async getProgress(){
        throw "Not Implemented"
    }

    async getState(){
        throw "Not Implemented"
    }
}

AbstractTask.taskIndex = {}

module.exports = AbstractTask