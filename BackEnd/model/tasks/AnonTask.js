const { OTJSForbiddenException } = require("../../Exceptions/OTJSErrors");
const OrthancQueue = require("../OrthancQueue");
const TaskType = require("../TaskType");

let orthancQueue = new OrthancQueue;

class AnonTask {
    
    static async createTask(creator, orthancIds){
        let task = await AnonTask.getUserTask(creator);
        if(!!task){
            if(['completed','failed'].includes(task.state)){
                AnonTask.delete(task.id);
            }
            else{
                throw new OTJSForbiddenException("Cant create two anonymiztion simulteanously");
            }
        }
        return orthancQueue.anonimizeItems(creator, orthancIds)
    }

    static async getTask(id){
        let jobs = await orthancQueue.getAnonimizationJobs(id);
        if (jobs.length === 0) return null;
        
        let progress = 0
        let length = jobs.length
        for (let i = 0; i < length; i++) {
            const job = jobs[i]
            progress += await job.progress()
        }
        progress /= length;
        
        let state 
        if(progress == 0) {
            state = 'wait'
        }else if(progress==100) {
            state = 'completed'
        }else {
            state = 'active'
        }

        return {
            id,
            type: TaskType.ANONYMIZE,
            creator: jobs[0].data.creator,
            progress,
            state,
            content: {
                items : await Promise.all(jobs.map(async job=>{
                    let state = await job.getState()
                    let item={
                        source: job.data.item.sourceOrthancStudyID,
                        state,
                        result: (state === "completed"? await job.finished(): null)
                    }
                    return item;
                }))
            }
        }
    }

    static async getUserTask(user){
        let validateJobs = await orthancQueue.getUserAnonimizationJobs(user);
        if(validateJobs.length === 0) return null;
        return AnonTask.getTask(validateJobs[0].length);
    }

    static async getTasks(){
        let jobs = await orthancQueue.anonQueue.getJobs()
        let ids = [];
        for (const job of jobs) {
            if (!(job.data.id in ids)) {
                ids.push(job.data.id);
            }
        }
        return await Promise.all(ids.map(id=>AnonTask.getTask(id)));
    }

    static async  delete(taskId){
        let anonJobs = await orthancQueue.getAnonimizationJobs(taskId);
        anonJobs.forEach(job=>job.remove());
    }
}

module.exports = AnonTask