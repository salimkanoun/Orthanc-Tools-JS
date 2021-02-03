const AbstractTask = require("../AbstractTask");
const Exporter = require("../export/Exporter");
const OrthancQueue = require("../OrthancQueue");
const CreateArchiveTask = require('./CreateArchiveTask')
const SendTask = require('./SendTask')

let orthanc =new OrthancQueue();
let exporter = new Exporter();

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
        //Get state based on child tasks
        let createState = (this.createTask?await this.createTask.getState():'waiting')
        let sendState = (this.sendTask?await this.sendTask.getState():'waiting')

        //Return the state based on the child task state
        if(createState==='waiting' && createState===sendState) return 'pending archiving'
        else if(createState==='active' && sendState==='waiting') return 'archiving'
        else if(createState==='completed' && sendState==='waiting') return 'pending sending'
        else if(createState==='completed' && sendState==='active') return 'sending'
        else if(createState==='completed' && createState===sendState) return 'completed'
        else return 'failed'
    }

    /**
     * Export an archive containing the dicom of given studies
     */
    async run(){
        //Generate the archive based 
        this.createTask = new CreateArchiveTask(this.creator, this.studies)
        let path = await this.createTask.run()
        
        //Send the archive
        this.sendTask = new SendTask(this.creator, path, this.endpoint)
        await this.sendTask.run()
        this.onCompleted()
    }

    static async getTask(id){
        //Seraching for the relevant Jobs
        let archiveJob = await orthanc.getArchiveCreationJobs(id);
        let sendJob = await exporter.getUploadJobs(id);
        
        if(!archiveJob[0] && !sendJob[0])return null;
        

        //Computing the state
        let archiveState = (archiveJob[0]?await archiveJob[0].getState():'waiting')
        let sendState = (sendJob[0]?await sendJob[0].getState():'waiting')
        let state;
        if(archiveState==='waiting' && archiveState===sendState) state = 'pending archiving'
        else if(archiveState==='active' && sendState==='waiting') state = 'archiving'
        else if(archiveState==='completed' && sendState==='waiting') state = 'pending sending'
        else if(archiveState==='completed' && sendState==='active') state = 'sending'
        else if(archiveState==='completed' && archiveState===sendState) state = 'completed'
        else state = 'failed'
        
        return {
            id,
            type: "export",
            creator: archiveJob[0].data.creator,
            progress: {
                archiving : (archiveJob[0]?await archiveJob[0].progress():0),
                sending : (sendJob[0]?await sendJob[0].progress():0)
            },
            state,
            content: {}
        }
    }
}

module.exports = ExportTask