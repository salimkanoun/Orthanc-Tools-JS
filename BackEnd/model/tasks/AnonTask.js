const { OTJSForbiddenException } = require("../../Exceptions/OTJSErrors");
const OrthancQueue = require("../OrthancQueue");
const TaskType = require("../TaskType");

let orthancQueue = new OrthancQueue;

const JOB_STATUS = ['completed', 'wait', 'active', 'delayed', 'failed'];
const JOBS_TTL = 5;

class AnonTask {
    /**
     * Get the average progress of all the jobs of a task
     * @param {[Jobs]} jobs jobs of the task 
     * @returns {number} number between 0 and 100 of the progress
     */
    static async getProgress(jobs){
        let progress = 0
        let length = jobs.length
        for (let i = 0; i < length; i++) {
            const job = jobs[i]
            progress += (['completed','failed'].includes(await job.getState())?100:await job.progress())
        }
        return progress / length;
    }

    /**
     * Create the anonimization task
     * @param {string} creator username of the creator of the task
     * @param {[any]} studies studies to be anonymised
     * @returns {string} the uuid of the task 
     */
    static async createTask(creator, studies){
        let task = (await AnonTask.getUserTask(creator)||[])[0];
        // Checking for existing task of the user 
        if (!!task && !['completed', 'failed'].includes(task.state)) {
            throw new OTJSForbiddenException("Cant create two retrieval simulteanously");
        }

        //Removing the oldest task and decreasing the ttl of other task
        await AnonTask.decay(creator);

        //Creating the corresponding jobs
        return orthancQueue.anonimizeItems(creator, studies, JOBS_TTL);
    }

    /**
     * return the task corresponding to the task ID
     * @param {string} id the uuid of the task to be returned
     * @returns {Task} the task info
     */
    static async getTask(id){
        //Gathering the jobs of the corresponding task
        let jobs = await orthancQueue.getAnonimizationJobs(id);

        //If no jobs of this task exist then the task doesn't exist 
        if (jobs.length === 0) return null;
         
        let progress = await AnonTask.getProgress(jobs);
        
        //making state
        let state = null;
        if(progress == 0) {
            state = 'wait'
        }else if(progress==100) {
            for (const job of jobs) {
                if(job.getState()==='failed') state = 'failed';
            }
            if(state === null) state = 'completed';
        }else {
            state = 'active'
        }

        return {
            id,
            type: TaskType.ANONYMIZE,
            creator: jobs[0].data.creator,
            progress,
            state,
            details: {
                items : // Format jobs into usable info about the items
                    await Promise.all(jobs.map(async job=>{
                    let state = await job.getState()
                    let item={
                        source: job.data.item.sourceOrthancStudyID,
                        state,
                        result: (state === "completed"? await job.finished(): null)
                    }
                    return item;
                }))
            }, 
            ttl: jobs[0].data.ttl
        }
    }

    /**
     * get the tasks  of a corresponding user
     * @param {string} user creator of the task to be returned
     * @returns {[id]} tasks uuids of the user 
     */
    static async getUserTask(user){
        let anonJobs = await orthancQueue.getUserAnonimizationJobs(user);
        if(anonJobs.length === 0) return null;
        
        let ids = [];
        for (const job of anonJobs) {
            if (!(ids.includes(job.data.taskId))) {
                ids[JOBS_TTL - job.data.ttl] = job.data.taskId;
            }
        }
        return ids;
    }

    /**
     * get the tasks of this type
     * @returns {[Task]} tasks of this type
     */
    static async getTasks(){
        let jobs = await orthancQueue.anonQueue.getJobs();

        //Makes a set of the ids of the task
        let ids = [];
        for (const job of jobs) {
            if (!(ids.includes(job.data.taskId))) {
                ids.push(job.data.taskId);
            }
        }

        return await Promise.all(ids.map(id=>AnonTask.getTask(id)));
    }

    /**
     * delete the task of a given id
     * @param {string} taskId uuid of the task to be deleted
     */
    static async  delete(taskId){
        let anonJobs = await orthancQueue.getAnonimizationJobs(taskId);
        anonJobs.forEach(job=>job.remove()); //Delete jobs of the task 
    }

    /**
     * Remove all jobs for anonimization
     */
    static async flush(){
        await Promise.all(JOB_STATUS.map(x=>orthancQueue.anonQueue.clean(1, x)));
    }

    /**
     * reduce the time to live of all the jobs of an user
     */
    static async decay(user) {
        let jobs = await orthancQueue.getUserAnonimizationJobs(user);

        await Promise.all(jobs.map(x => {
            if (x.data.ttl === 1) {
                return x.remove();
            } else {
                return x.update(
                    {
                        ...x.data,
                        ttl: x.data.ttl - 1
                    }
                );
            }
        }));
    }
}

module.exports = AnonTask