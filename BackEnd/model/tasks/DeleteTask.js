const AbstractTask = require("../AbstractTask");
const OrthancQueue = require("../OrthancQueue");
const orthancQueue = new OrthancQueue()

class DeleteTask extends AbstractTask{
    constructor(creator, orthancSeriesIds){
        super(creator, 'delete')
        this.orthancSeriesIds = orthancSeriesIds
        this.jobs = [];
    }

    async getProgress(){
        let completed = 0
        for (let i = 0; i < this.jobs.length; i++) {
            const item = this.jobs[i];
            if(await item.getState()==='completed') completed++
        }
        return completed/this.orthancSeriesIds.length*100
    }

    async getState(){
        if(await this.getProgress()===0) {
            return 'wait'
        }else if(await this.getProgress()===100) {
            return 'completed'
        }else {
            return 'active'
        }
    }

    /**
     * Delete series base on the ids 
     */
    async run(){
        this.jobs = await orthancQueue.queueDeleteItems(this.orthancSeriesIds)
        await Promise.all(this.jobs.map(job=>job.finished()))
        this.onCompleted()
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
            type: 'delete',
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
}

module.exports = DeleteTask