const uuid = require("../utils/uuid")

class AbstractTask {
    constructor(creator, type = '') {
        this.id = uuid.getUuid()
        this.creator = creator
        this.type = type
        AbstractTask.taskIndex[this.id] = this
        if(Object.keys(AbstractTask.taskTypeUserIndex).includes(type)){
            console.log('test')
            AbstractTask.taskTypeUserIndex[type][creator] = this;
        }
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
AbstractTask.taskTypeUserIndex = {}
AbstractTask.taskTypeUserIndex['retrieve'] = {}
AbstractTask.taskTypeUserIndex['anonymize'] = {}
AbstractTask.taskTypeUserIndex['delete'] = {}
AbstractTask.taskTypeUserIndex['export'] = {}

module.exports = AbstractTask