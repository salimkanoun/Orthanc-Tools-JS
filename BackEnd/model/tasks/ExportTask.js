const Exporter = require("../export/Exporter");
const OrthancQueue = require("../OrthancQueue");
const TaskType = require("../TaskType");


let orthancQueue =new OrthancQueue();
let exporter = new Exporter();

const jobsStatus = ['completed', 'wait', 'active', 'delayed', 'failed']

class ExportTask {

    /**
     * Create the export task
     * @param {string} creator username of the creator of the task
     * @param {[any]} studies studies to be exported
     * @param {Endpoint} endpoint endpoint to export the studies to
     * @param {string} transcoding transcoding to be used to create the archive 
     * @returns {string} the uuid of the task 
     */
    static async createTask(creator, studies, endpoint, transcoding = null){
        return orthancQueue.exportToEndpoint(creator, studies, transcoding, endpoint);
    }

    /**
     * return the task corresponding to the task ID
     * @param {string} id the uuid of the task to be returned
     * @returns {Task} the task info
     */
    static async getTask(id){
        //Seraching for the relevant Jobs
        let archiveJob = await orthancQueue.getArchiveCreationJobs(id);
        let sendJob = await exporter.getUploadJobs(id);
        
        //If no jobs of this task exist then the task doesn't exist 
        if(!archiveJob[0] && !sendJob[0])return null;
        

        //Computing the sub-states
        let archiveState = (archiveJob[0]?await archiveJob[0].getState():'waiting')
        let sendState = (sendJob[0]?await sendJob[0].getState():'waiting')
        
        //Computing the states
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
            details: {}
        }
    }

    /**
     * get the task corresponding of user
     * @param {string} user creator of the task to be returned
     * @returns {Task} task of the user 
     */
    static async getUserTask(user){
        let archiveJobs = await orthancQueue.getUserArchiveCreationJobs(user);
        if(archiveJobs.length === 0) return null;
        return ExportTask.getTask(archiveJobs[0].data.taskId);
    }

    /**
     * get the tasks of this type
     * @returns {[Task]} tasks of this type
     */
    static async getTasks(){
        let jobs = await orthancQueue.exportQueue.getJobs()
        let ids = [];
        
        //Makes a set of the ids of the task
        for (const job of jobs) {
            if (!(ids.includes(job.data.taskId))) {
                ids.push(job.data.taskId);
            }
        }

        return await Promise.all(ids.map(id=>ExportTask.getTask(id)));
    }

    /**
     * Remove all jobs for export
     */
    static async flush(){
        await Promise.all(jobsStatus.map(x=>orthancQueue.exportQueue.clean(1, x)));
        await Promise.all(jobsStatus.map(x=>exporter.sendQueue.clean(1, x)));
    }
}

module.exports = ExportTask