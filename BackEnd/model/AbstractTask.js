const uuid = require("../utils/uuid")

class AbstractTask {
    constructor(creator, type = '') {
        this.id = uuid.getUuid()
        this.creator = creator
        this.type = type
        AbstractTask.taskIndex[this.id] = this
        if(Object.keys(AbstractTask.taskTypeUserIndex).includes(type)){
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
    
    static getExistingTask(user,type){
        if(!Object.values(AbstractTask.TaskType).includes(type))
            throw new TypeError('Unkown Task Type')

        return AbstractTask.taskTypeUserIndex[type][user]||null
    }
}

AbstractTask.TaskType = {
    RETRIEVE : 'retrieve',
    EXPORT : 'export',
    ANONYMIZE : 'anonymize',
    DELETE : 'delete',
}

AbstractTask.taskIndex = {}
AbstractTask.taskTypeUserIndex = {}
Object.values(AbstractTask.TaskType).forEach(type => {
    AbstractTask.taskTypeUserIndex[type] = {}
});

module.exports = AbstractTask