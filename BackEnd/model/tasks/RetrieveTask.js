const { OTJSForbiddenException, OTJSNotFoundException } = require("../../Exceptions/OTJSErrors");
const OrthancQueue = require("../OrthancQueue");
const TaskType = require("../TaskType");

let orthancQueue = new OrthancQueue();

class RetrieveTask {

    static async createTask(creator, projectName, answers){
        let task = await RetrieveTask.getUserTask(creator);
        if(!!task){
            if(['completed','failed'].includes(task.state)){
                RetrieveTask.delete(task.id);
            }
            else{
                throw new OTJSForbiddenException("Cant create two retrieval simulteanously");
            }
        }
        return orthancQueue.validateItems(creator, projectName, answers)
    }

    static async validateTask(creator){
        let task = await RetrieveTask.getUserTask(creator);
        if(task===null) throw new OTJSNotFoundException("No task of this kind");
        orthancQueue.approveTask(task.id);
    }

    static async getTask(id){
        let validateJobs = await orthancQueue.getValidationJobs(id);
        if(validateJobs.length === 0) return null;
        let retrieveJobs = await orthancQueue.getRetrieveItem(id);

        let validation = 0;
        for (const job of validateJobs) {
            validation += await job.progress();
        }
        validation /= validateJobs.length;

        let retrieve = 0;
        for (const job of retrieveJobs) {
            retrieve += await job.progress();
        }
        retrieve /= (retrieveJobs.length === 0 ? 1 : retrieveJobs.length);

        let state 
        if (validation === 0) {
            state = 'waiting validation'
        } else if (validation < 100) {
            state = 'validation'
        } else if (validation === 100 && retrieve === 0 && validateJobs.length === 0) {
            state = 'waiting retireve'
        } else if (validation === 100 && retrieve < 100 && validateJobs.length !== 0) {
            state = 'retireve'
        } else if (validation === 100 && retrieve === 100 && validateJobs.length !== 0) {
            state = 'completed'
        } else state = 'failed'

        let autoValidation = true;
        let items = []
        for (let i = 0; i < validateJobs.length; i++) {
            const validateJob = validateJobs[i];
            const retrieveJob = retrieveJobs[i];
            let Validated = (await validateJob.getState() === 'completed' ? await validateJob.finished(): false);
            autoValidation = autoValidation&& Validated;
            items.push({
                ...validateJob.data.item,
                Validated,
                Status: (retrieveJob? await retrieveJob.getState():'waiting')
            })
        }

        let isValidated;
        if(autoValidation&&retrieveJobs.length>0){
            isValidated = "Validated"
        }else if(autoValidation){
            isValidated =  "Waiting Approbation"
        }else {
            isValidated =  "Validating"
        }

        return {
            id,
            type: TaskType.RETRIEVE,
            creator: validateJobs[0].data.creator,
            progress:  {
                validation,
                retrieve
            },
            state,
            content: {
                projectName : validateJobs[0].data.projectName,
                isValidated,
                items
            }
        }
    }

    static async getUserTask(user){
        let validateJobs = await orthancQueue.getUserValidationJobs(user);
        if(validateJobs.length === 0) return null;
        return RetrieveTask.getTask(validateJobs[0].data.taskId);
    }

    static async getTasks(){
        let jobs = await orthancQueue.validationQueue.getJobs()
        let ids = [];
        for (const job of jobs) {
            if (!(job.data.taskId in ids)) {
                ids.push(job.data.taskId);
            }
        }
        return await Promise.all(ids.map(id=>RetrieveTask.getTask(id)));
    }

    static async  deleteItem(taskId, itemId){
        let retrieveJobs = await orthancQueue.getRetrieveItem(taskId);
        if (retrieveJobs.length !== 0) throw new OTJSForbiddenException("Can't delete an robot already in progress");
        let validateJobs = await orthancQueue.getValidationJobs(taskId);
        
        validateJobs.filter(job => job.data.item.AnswerNumber == itemId)[0].remove();
    }

    static async delete(taskId){
        let retrieveJobs = await orthancQueue.getRetrieveItem(taskId);

        let stateComplete = (await Promise.all(retrieveJobs.map(job=>job.getState()))).reduce((acc,x)=>acc=acc&&x==='completed',true);

        if (retrieveJobs.length !== 0 && !stateComplete) throw new OTJSForbiddenException("Can't delete an robot already in progress");
        let validateJobs = await orthancQueue.getValidationJobs(taskId);

        validateJobs.forEach(job=>job.remove());
        retrieveJobs.forEach(job=>job.remove());
    }
}

module.exports = RetrieveTask