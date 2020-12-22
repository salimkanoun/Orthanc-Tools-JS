const uuid = require("../utils/uuid")


/**
 * Represents a task to be executed by Orthanc Tool js
 */
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

    /**
     * return the promise of the execution of the task
     */
    async run() {
        throw typeof (this) + ":run() Not Implemented"
    }

    /**
     * returns the current progress of the task
     */
    async getProgress() {
        throw typeof (this) + ":getProgress() : Not Implemented"
    }

    /**
     * returns the current state of the task
     */
    async getState() {
        throw typeof (this) + ":getState() :  Not Implemented"
    }

    /**
     * Stops the task
     */
    async delete(){
        throw typeof (this) + ":delete() :  Not Implemented"
    }

    /**
     * returns an object with the specific information about the task
     */
    async getContent(){
        return {}
    }

    /**
     * returns an object with the informations to be sent by the API
     */
    async getSendable() {
        return {
            id: this.id,
            type: this.type,
            creator: this.creator,
            progress: await this.getProgress(),
            state: await this.getState(),
            content: await this.getContent()
        }
    }

    /**
     * returns an object with the informations to be sent by the API
     */
    async onCompleted(){
        if(Object.values(AbstractTask.TaskType).includes(type))
            AbstractTask.taskTypeUserIndex[this.creator][this.type] = null
    }
    
    /**
     * Returns the task for the user of the correct type
     * @param {string} user 
     * @param {TaskType} type 
     */
    static getTaskOfUser(user,type){
        if(!Object.values(AbstractTask.TaskType).includes(type))
            throw new TypeError('Unkown Task Type')
        return AbstractTask.taskTypeUserIndex[type][user]||null
    }

    /**
     * Returns the tasks for a type
     * @param {string} user 
     * @param {TaskType} type 
     */
    static getTasksOfType(type){
        if(!Object.values(AbstractTask.TaskType).includes(type))
            throw new TypeError('Unkown Task Type')

        return Object.values(AbstractTask.taskTypeUserIndex[type]).filter((v)=>!!v)
    }
}

// The types of the user accessible tasks
AbstractTask.TaskType = {
    RETRIEVE : 'retrieve',
    EXPORT : 'export',
    ANONYMIZE : 'anonymize',
    DELETE : 'delete',
}

//An object mapping ids to the corresponding task 
AbstractTask.taskIndex = {}

//An object mapping type and user to the corresponding task
AbstractTask.taskTypeUserIndex = {}
Object.values(AbstractTask.TaskType).forEach(type => {
    AbstractTask.taskTypeUserIndex[type] = {}
});

module.exports = AbstractTask