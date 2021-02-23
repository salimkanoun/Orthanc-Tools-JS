
const { OTJSForbiddenException, OTJSNotFoundException } = require("../../Exceptions/OTJSErrors");
const OrthancQueue = require("../OrthancQueue");
const TaskType = require("../TaskType");

let orthancQueue = new OrthancQueue();

const jobsStatus = ['completed', 'wait', 'active', 'delayed', 'failed']

class RetrieveTask {

    /**
     * Get the progress of a task based on its jobs
     * @param {[Jobs]} validationJobs validation jobs of the task 
     * @param {[Jobs]} retrieveJobs retrive jobs of the task 
     * @returns {any} objecting containing the progress of the task
     */
    static async getProgress(validationJobs, retrieveJobs){
        let validation = 0;
        for (const job of validationJobs) {
            validation +=  (['completed','failed'].includes(await job.getState())?100:await job.progress());
        }
        validation /= validationJobs.length;

        let retrieve = 0;
        for (const job of retrieveJobs) {
            retrieve +=  (['completed','failed'].includes(await job.getState())?100:await job.progress());
        }
        retrieve /= (retrieveJobs.length === 0 ? 1 : retrieveJobs.length);
        return{
            validation,
            retrieve,
        }
    }

    /**
     * Create the retrieve task
     * @param {string} creator username of the creator of the task
     * @param {string} projectName name of the retrieve project
     * @param {[any]} answers querry answers from the aet to be retrieve from the aet
     * @returns {string} the uuid of the task 
     */
    static async createTask(creator, projectName, answers){
        let task = await RetrieveTask.getUserTask(creator);
        // Checking for existing task of the user 
        if(!!task){
            // If the task is complete delete it if not theres an exception
            if(['completed','failed'].includes(task.state)){
                RetrieveTask.delete(task.id);
            }
            else{
                throw new OTJSForbiddenException("Cant create two retrieval simulteanously");
            }
        }
        
        //Creating the corresponding jobs
        return orthancQueue.validateItems(creator, projectName, answers)
    }

    /**
     * give the administrator approbation to the retrieve task
     * @param {string} creator username of the creator of the task
     */
    static async validateTask(creator){
        let task = await RetrieveTask.getUserTask(creator);
        if(task===null) throw new OTJSNotFoundException("No task of this kind");
        orthancQueue.approveTask(task.id);
    }

    /**
     * return the task corresponding to the task ID
     * @param {string} id the uuid of the task to be returned
     * @returns {Task} the task info
     */
    static async getTask(id){
        //Gathering the jobs of the corresponding task
        let validationJobs = await orthancQueue.getValidationJobs(id);
        if(validationJobs.length === 0) return null; //If no jobs of this task exist then the task doesn't exist
        let retrieveJobs = await orthancQueue.getRetrieveItem(id);

        let progress = await RetrieveTask.getProgress(validationJobs, retrieveJobs);

        //Making state
        let state = null;
        if (progress.validation === 0) {
            state = 'waiting validation';
        } else if (progress.validation < 100) {
            state = 'validation';
        } else if (progress.validation === 100 && progress.retrieve === 0 && retrieveJobs.length === 0) {
            state = 'waiting retireve'
        } else if (progress.validation === 100 && progress.retrieve < 100 && retrieveJobs.length !== 0) {
            state = 'retrieve';
        } else if (progress.validation === 100 && progress.retrieve === 100 && retrieveJobs.length !== 0) {
            state = 'completed';
            for (const job of validationJobs) {
                if(job.getState()==='failed') state = 'failed';
            }
            for (const job of retrieveJobs) {
                if(job.getState()==='failed') state = 'failed';
            }
        } else state = 'failed';

        //Check for the validation of the task and gather the items
        let valid = true;
        let items = []
        for (let i = 0; i < validationJobs.length; i++) {
            const validateJob = validationJobs[i];
            const retrieveJob = retrieveJobs[i];
            let Validated = (await validateJob.getState() === 'completed' ? await validateJob.finished(): null);
            valid = valid && !!Validated;
            const state = (retrieveJob? await retrieveJob.getState() : 'waiting');
            items.push({
                ...validateJob.data.item,
                Validated,
                Status: state,
                RetrievedOrthancId: (state==="completed"? await retrieveJob.finished():null)
            })
        }

        let approved = valid && retrieveJobs.length > 0

        return {
            id,
            type: TaskType.RETRIEVE,
            creator: validationJobs[0].data.creator,
            progress,
            state,
            details: {
                projectName : validationJobs[0].data.projectName,
                valid,
                approved,
                items
            }
        }
    }

     /**
     * get the task corresponding of user
     * @param {string} user creator of the task to be returned
     * @returns {Task} task of the user 
     */
    static async getUserTask(user){
        let validateJobs = await orthancQueue.getUserValidationJobs(user);
        if(validateJobs.length === 0) return null;
        return RetrieveTask.getTask(validateJobs[0].data.taskId);
    }

    /**
     * get the tasks of this type
     * @returns {[Task]} tasks of this type
     */
    static async getTasks(){
        let jobs = await orthancQueue.validationQueue.getJobs()
        let ids = [];
        for (const job of jobs) {
            if (!(ids.includes(job.data.taskId))) {
                ids.push(job.data.taskId);
            }
        }
        return await Promise.all(ids.map(id=>RetrieveTask.getTask(id)));
    }

    /**
     * delete an item of the retrieve task
     * @param {string} taskId uuid of the task 
     * @param {string} itemId id of the item to be deleted 
     */
    static async  deleteItem(taskId, itemId){
        let retrieveJobs = await orthancQueue.getRetrieveItem(taskId);
        if (retrieveJobs.length !== 0) throw new OTJSForbiddenException("Can't delete a robot already in progress");
        let validateJobs = await orthancQueue.getValidationJobs(taskId);
        let answerId = itemId.split(':')[1];
        let answerNumber = itemId.split(':')[0];
        validateJobs.filter(job => job.data.item.AnswerNumber == answerNumber && job.data.item.AnswerId == answerId)[0].remove();
    }

    /**
     * delete the task of a given id
     * @param {string} taskId uuid of the task to be deleted
     */
    static async delete(taskId){
        let retrieveJobs = await orthancQueue.getRetrieveItem(taskId);

        //Checking if all the jobs are finished
        let stateComplete = (await Promise.all(retrieveJobs.map(job=>job.getState()))).reduce((acc,x)=>acc&&x==='completed',true);

        if (retrieveJobs.length !== 0 && !stateComplete) throw new OTJSForbiddenException("Can't delete a robot already in progress");
        let validateJobs = await orthancQueue.getValidationJobs(taskId);

        validateJobs.forEach(job=>job.remove());
        retrieveJobs.forEach(job=>job.remove());
    }

    /**
     * Remove all jobs for retrieval
     */
    static async flush(){
        await Promise.all(jobsStatus.map(x=>orthancQueue.aetQueue.clean(1, x)));
        await Promise.all(jobsStatus.map(x=>orthancQueue.validationQueue.clean(1, x)));
    }
}

module.exports = RetrieveTask