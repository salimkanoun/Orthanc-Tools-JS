const uuid = require("../utils/uuid")

class AbstractTask {
    constructor(creator) {
        this.id = uuid.getUuid()
        this.creator = creator
        AbstractTask.taskIndex[this.id] = this
    }

    async run() {
        throw typeof (this) + ":run() Not Implemented"
    }

    async getProgress() {
        throw typeof (this) + ":getProgress() : Not Implemented"
    }

    async getState() {
        throw typeof (this) + ":getState() :  Not Implemented"
    }

    async getContent(){
        return {}
    }

    async getFormated() {
        return {
            id: this.id,
            type: this.type,
            creator: this.creator,
            progress: await this.getProgress(),
            state: await this.getState(),
            content: await this.getContent()
        }
    }
}

AbstractTask.taskIndex = {}

module.exports = AbstractTask