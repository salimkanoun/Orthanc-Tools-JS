const { OTJSForbiddenException } = require("../../Exceptions/OTJSErrors");
const OrthancQueue = require("../OrthancQueue");
const TaskType = require("../TaskType");
const orthancQueue = new OrthancQueue()

class DeleteTask {

    static async createTask(creator, orthancIds){
        let task = await DeleteTask.getUserTask(creator);
        if(!!task){
            if(['completed','failed'].includes(task.state)){
                DeleteTask.delete(task.id);
            }
            else{
                throw new OTJSForbiddenException("Cant create two deletion simulteanously");
            }
        }
        return orthancQueue.deleteItems(creator, orthancIds);
    }

    static async getTask(id){

        let jobs = await orthancQueue.getDeleteJobs(id);
        
        if(jobs.length === 0) return null;

        let progress = 0;
        for (const job of jobs) {
            progress += ((await job.getState())==='completed'?100:0);
        }
        progress /= jobs.length;

        let state;
        switch(progress){
            case 0 :
                state = 'wait'; 
                break;
            case 100 : 
                state = 'completed';
                break;
            default : 
                state = "active";
                break;
        }

        return {
            id,
            type: TaskType.DELETE,
            creator: jobs[0].data.creator,
            progress,
            state,
            content: {}
        }
    }

    static async getUserTask(user){
        let deleteJobs = await orthancQueue.getDeleteJobs(user);
        if(deleteJobs.length === 0) return null;
        return DeleteTask.getTask(deleteJobs[0].length);
    }

    static async getTasks(){
        let jobs = await orthancQueue.deleteQueue.getJobs()
        let ids = [];
        for (const job of jobs) {
            if (!(job.data.id in ids)) {
                ids.push(job.data.id);
            }
        }
        return await Promise.all(ids.map(id=>DeleteTask.getTask(id)));
    }

    static async  delete(taskId){
        let deleteJobs = await orthancQueue.getDeleteJobs(taskId);
        deleteJobs.forEach(job=>job.remove());
    }
}

module.exports = DeleteTask