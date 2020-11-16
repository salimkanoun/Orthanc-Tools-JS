const AbstractTask = require("../AbstractTask");
const CreateArchiveTask = require('./CreateArchiveTask')
const SendTask = require('./SendTask')

class ExportTask extends AbstractTask{
    constructor(creator, studies, endpoint){
        super(creator, 'export')
        this.studies = studies 
        this.endpoint = endpoint

        this.createTask = null
        this.sendTask = null
    }

    async getProgress(){
        let archiving = (this.createTask ? await this.createTask.getProgress() : 0) 
        let sending = (this.sendTask ? await this.sendTask.getProgress() : 0)
        return {
            archiving,
            sending,
            total:(archiving+sending)/2
        }
    }

    async getState(){
        let createState = (this.createTask?await this.createTask.getState():'waiting')
        let sendState = (this.sendTask?await this.sendTask.getState():'waiting')

        if(createState==='waiting' && createState===sendState) return 'pending archiving'
        else if(createState==='active' && sendState==='waiting') return 'archiving'
        else if(createState==='completed' && sendState==='waiting') return 'pending sending'
        else if(createState==='completed' && sendState==='active') return 'sending'
        else if(createState==='completed' && createState===sendState) return 'completed'
        else return 'failed'
    }

    async run(){
        this.createTask = new CreateArchiveTask(this.creator, this.studies)
        let path = await this.createTask.run()
        this.sendTask = new SendTask(this.creator, path, this.endpoint)
        await this.sendTask.run()
    }
}

module.exports = ExportTask