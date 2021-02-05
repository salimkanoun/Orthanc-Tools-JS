const { OTJSNotFoundException } = require("../../Exceptions/OTJSErrors");
const Exporter = require("../export/Exporter");
const OrthancQueue = require("../OrthancQueue");
const TaskType = require("../TaskType");


let orthanc =new OrthancQueue();
let exporter = new Exporter();

class ExportTask {

    static async createTask(creator, studies,  endpoint, transcoding = null){
        return orthancQueue.exportToEndpoint(creator, studies, transcoding, endpoint);
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
            type: TaskType.EXPORT,
            creator: archiveJob[0].data.creator,
            progress: {
                archiving : (archiveJob[0]?await archiveJob[0].progress():0),
                sending : (sendJob[0]?await sendJob[0].progress():0)
            },
            state,
            content: {}
        }
    }

    static async getUserTask(user){
        let archiveJobs = await orthancQueue.getUserArchiveCreationJobs(user);
        if(archiveJobs.length === 0) return null;
        return ExportTask.getTask(archiveJobs[0].data.taskId);
    }

    static async getTasks(){
        let jobs = await orthancQueue.createState.getJobs()
        let ids = [];
        for (const job of jobs) {
            if (!(job.data.id in ids)) {
                ids.push(job.data.id);
            }
        }
        return await Promise.all(ids.map(id=>ExportTask.getTask(id)));
    }
}

module.exports = ExportTask