const AbstractTask = require("../AbstractTask");
const OrthancQueue = require("../OrthancQueue");
const AnonItemTask = require("./AnonItemTask");

let orthancQueue = new OrthancQueue;

class AnonTask extends AbstractTask{
    constructor(creator, items){
        super(creator, 'anonymize')
        this.itemTasks = []
        items.forEach(item => {
            this.itemTasks.push(new AnonItemTask(creator, item.orthancStudyID, item.profile, item.newPatientName, item.newPatientID, item.newStudyDescription, item.newAccessionNumber))
        })
    }

    async getProgress(){
        let sum = 0
        let length = this.itemTasks.length
        for (let i = 0; i < length; i++) {
            const task = this.itemTasks[i]
            const progress = await task.getProgress()
            sum += progress
        }
        return sum/length
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

    async getContent(){
        let items = []
        for (let i = 0; i < this.itemTasks.length; i++) {
            const item = this.itemTasks[i];
            items.push(await item.getContent())
        }
        return{
            items
        }
    }

    /**
     * Anonymise studies of a given ids
     */
    async run(){
        await Promise.all(this.itemTasks.map(task=>task.run()))
        this.onCompleted()
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
            type: "anonymize",
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