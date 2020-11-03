const AbstractTask = require("../AbstractTask");
const CreateArchiveTask = require('./CreateArchiveTask')
const SendTask = require('./SendTask')

class ExportTask extends AbstractTask{
    constructor(studies, endpoint){
        super()
        this.studies = studies 
        this.endpoint = endpoint

        this.createTask = null
        this.sendTask = null
    }

    async getProgress(){
        return {
            creation: (this.createTask ? await this.createTask.getProgress() : 0),
            send: (this.sendTask ? await this.sendTask.getProgress() : 0)
        }
    }

    async getState(){
        let createState = (this.createTask?await this.createTask.getState():'wait')
        let sendState = (this.createTask?await this.createTask.getState():'wait')

        if(createState==='wait' && createState===sendState) return 'pending archiving'
        else if(createState==='active' && createState==='wait') return 'archiving'
        else if(createState==='completed' && createState==='wait') return 'pending sending'
        else if(createState==='completed' && createState==='active') return 'sending'
        else if(createState==='completed' && createState==='complete') return 'sent'
        else return 'failed'
    }

    async run(){
        this.createTask = new CreateArchiveTask(this.studies)
        let path = await this.createTask.run()
        this.sendTask = new SendTask(path, this.endpoint)
        await this.sendTask.run()
    }
}

module.exports = ExportTask