const { remove } = require("jszip");
const { validate } = require("uuid");
const { OTJSForbiddenException } = require("../../Exceptions/OTJSErrors");
const AbstractTask = require("../AbstractTask");
const OrthancQueue = require("../OrthancQueue");
const { getTask } = require("./AnonTask");
const RetrieveItemTask = require("./RetrieveItemTask");
const ValidateRetrieveTask = require("./ValidateRetrieveTask");

let orthancQueue = new OrthancQueue();

class RetrieveTask extends AbstractTask {
    constructor(creator, projectName, queryAnswers, target) {
        super(creator, 'retrieve')

        this.projectName = projectName
        this.queryAnswers = queryAnswers

        this.validationTasks = []
        this.retrieveItemTasks = []
    }

    async getProgress() {
        // Average the progress of the validation
        let validation = 0
        for (let i = 0; i < this.validationTasks.length; i++) {
            const task = this.validationTasks[i]
            validation += await task.getProgress()
        }
        validation /= this.queryAnswers.length

        // Average the progress of the retrieve
        let retrieve = 0
        for (let i = 0; i < this.retrieveItemTasks.length; i++) {
            const task = this.retrieveItemTasks[i]
            retrieve += await task.getProgress()
        }
        retrieve /= this.queryAnswers.length
        
        return {
            validation: Math.round(validation),
            retrieve: Math.round(retrieve)
        }
    }

    async getState() {
        let progress = await this.getProgress();
        if (progress.validation === 0) {
            return 'waiting validation'
        } else if (progress.validation < 100) {
            return 'validation'
        } else if (progress.validation === 100 && progress.retrieve === 0 && this.isValidated()) {
            return 'waiting retireve'
        } else if (progress.validation === 100 && progress.retrieve < 100 && this.isValidated()) {
            return 'retireve'
        } else if (progress.validation === 100 && progress.retrieve === 100 && this.isValidated()) {
            return 'completed'
        } else return 'failed'
    }

    isValidated() {
        // Chack every items for validation
        let autoValidated = true;
        this.validationTasks.forEach(task => {
            autoValidated = autoValidated && (task ? task.validated : false);
        });
        autoValidated = autoValidated && this.validationTasks.length
        if(autoValidated&&this.validated){
            return "Validated"
        }else if(this.validated){
            return "Validating"
        }else {
            return "Waiting Approbation"
        }
    }

    async getContent() {
        let items = []
        for (let i = 0; i < this.queryAnswers.length; i++) {
            let item = {
                ...( this.retrieveItemTasks[i]?await this.retrieveItemTasks[i].getContent():this.queryAnswers[i]),
                Validated:this.validationTasks[i]?this.validationTasks[i].validated:false,
                Status: ( this.retrieveItemTasks[i]?await this.retrieveItemTasks[i].getState():'waiting')
            }
            items.push(item)   
        } 
        return{
            projectName : this.projectName,
            isValidated : this.isValidated(),
            items
        }
    }

    /**
     * Delete the task
     */
    delete(){
        this.validationTasks.forEach(task => {
            //Deleting all items
            task.delete()
        });
        this.retrieveItemTasks.forEach(task => {
            //Deleting all items
            task.delete()
        });
        this.queryAnswers = []
    }

    /**
     * Drop an item from the task
     * @param {integer} index 
     */
    async deleteItem(index){
        this.queryAnswers.splice(index,1)
    }

    /**
     * Validate then Retrieve the items correspponding to the querry
     */
    async run() {
        //Set the administror validation
        this.validated = true;

        //Validating the querry items
        this.validationTasks = this.queryAnswers.map(item => new ValidateRetrieveTask(this.creator, item));
        await Promise.all(this.validationTasks.map(task => task.run()));
        
        //Checking for the validation 
        if (!this.isValidated()=='Validated') {
            console.warn('Retrieve Task not validated')
            return;
        }

        //Retrieving items 
        this.retrieveItemTasks = this.queryAnswers.map(item => new RetrieveItemTask(this.creator, item))
        await Promise.all(this.retrieveItemTasks.map(task => task.run()))
        this.onCompleted()
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
        retrieve /= (retrieveJobs.length === 0 ? 1 : validateJobs.length);

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
            type: 'retrieve',
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
        
        console.log(itemId);
        validateJobs.filter(job => job.data.item.AnswerNumber == itemId)[0].remove();
        

    }

    static async  delete(taskId){
        let retrieveJobs = await orthancQueue.getRetrieveItem(taskId);
        if (retrieveJobs.length !== 0) throw new OTJSForbiddenException("Can't delete an robot already in progress");
        let validateJobs = await orthancQueue.getValidationJobs(taskId);
        
        validateJobs.forEach(job=>job.remove());

    }
}

module.exports = RetrieveTask