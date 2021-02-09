const { OTJSForbiddenException } = require("../../Exceptions/OTJSErrors");
const OrthancQueue = require("../OrthancQueue");
const TaskType = require("../TaskType");
const orthancQueue = new OrthancQueue()

class DeleteTask {

    /**
     * Get the progress of a task based on its jobs
     * @param {[Jobs]} jobs jobs of the task 
     * @returns {number} number between 0 and 100 of the progress
     */
    static async getProgress(jobs){
        let progress = 0;
        for (const job of jobs) {
            progress += (['completed','failed'].includes(await job.getState())?100:0);
        }
        return progress / jobs.length;
    }

    /**
     * Create the deletion task 
     * @param {string} creator username of the creator of the task
     * @param {[any]} orthancIds ids of studies to be deleted
     * @returns {string} the uuid of the task 
     */
    static async createTask(creator, orthancIds){
        let task = await DeleteTask.getUserTask(creator);
        // Checking for existing task of the user 
        if(!!task){
            // If the task is complete delete it if not theres an exception
            if(['completed','failed'].includes(task.state)){
                DeleteTask.delete(task.id);
            }
            else{
                throw new OTJSForbiddenException("Cant create two deletion simulteanously");
            }
        }
        //Creating the corresponding jobs
        return orthancQueue.deleteItems(creator, orthancIds);
    }

    /**
     * return the task corresponding to the task ID
     * @param {string} id the uuid of the task to be returned
     * @returns {Task} the task info
     */
    static async getTask(id){
        //Gathering the jobs of the corresponding task
        let jobs = await orthancQueue.getDeleteJobs(id);
        
        //If no jobs of this task exist then the task doesn't exist 
        if(jobs.length === 0) return null;

        let progress = await DeleteTask.getProgress(jobs);

        //Making the state
        let state = null;
        switch(progress){
            case 0 :
                state = 'wait'; 
                break;
            case 100 : 
                for (const job of jobs) {
                    if(job.getState()==='failed') state = 'failed';
                }
                if(state === null) state = 'completed';
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

    /**
     * get the task corresponding of user
     * @param {string} user creator of the task to be returned
     * @returns {Task} task of the user 
     */
    static async getUserTask(user){
        let deleteJobs = await orthancQueue.getUserDeleteJobs(user);
        if(deleteJobs.length === 0) return null;
        return DeleteTask.getTask(deleteJobs[0].data.taskId);
    }

    /**
     * get the tasks of this type
     * @returns {[Task]} tasks of this type
     */
    static async getTasks(){
        let jobs = await orthancQueue.deleteQueue.getJobs()

        //Makes a set of the ids of the task
        let ids = [];
        for (const job of jobs) {
            if (!(ids.includes(job.data.taskId))) {
                ids.push(job.data.taskId);
            }
        }
        return await Promise.all(ids.map(id=>DeleteTask.getTask(id)));
    }

    /**
     * delete the task of a given id
     * @param {string} taskId uuid of the task to be deleted
     */
    static async  delete(taskId){
        let deleteJobs = await orthancQueue.getDeleteJobs(taskId);
        deleteJobs.forEach(job=>job.remove()); //Delete jobs of the task 
    }
}

module.exports = DeleteTask