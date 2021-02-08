const { OTJSForbiddenException } = require("../../Exceptions/OTJSErrors");
const OrthancQueue = require("../OrthancQueue");
const Task = require("../Task");
const TaskType = require("../TaskType");

let orthancQueue = new OrthancQueue;

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
            progress += await job.progress()
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
        let task = await AnonTask.getUserTask(creator);
        // Checking for existing task of the user 
        if(!!task){
            // If the task is complete delete it if not theres an exception
            if(['completed','failed'].includes(task.state)){
                AnonTask.delete(task.id);
            }
            else{
                throw new OTJSForbiddenException("Cant create two anonymiztion simulteanously");
            }
        }
        //Creating the corresponding jobs
        return orthancQueue.anonimizeItems(creator, studies)
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
            }
        }
    }

    /**
     * get the task corresponding of user
     * @param {string} user creator of the task to be returned
     * @returns {Task} task of the user 
     */
    static async getUserTask(user){
        let validateJobs = await orthancQueue.getUserAnonimizationJobs(user);
        if(validateJobs.length === 0) return null;
        return AnonTask.getTask(validateJobs[0].length);
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
            if (!(job.data.id in ids)) {
                ids.push(job.data.id);
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
}

module.exports = AnonTask