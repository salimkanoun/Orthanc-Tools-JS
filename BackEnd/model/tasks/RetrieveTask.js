const { remove } = require("jszip");
const AbstractTask = require("../AbstractTask");
const RetrieveItemTask = require("./RetrieveItemTask");
const ValidateRetrieveTask = require("./ValidateRetrieveTask");

class RetrieveTask extends AbstractTask {
    constructor(creator, projectName, queryAnswers, target) {
        super(creator, 'retrieve')

        this.projectName = projectName
        this.queryAnswers = queryAnswers

        this.validationTasks = []
        this.retrieveItemTasks = []
    }

    async getProgress() {
        let validation = 0
        for (let i = 0; i < this.validationTasks.length; i++) {
            const task = this.validationTasks[i]
            validation += await task.getProgress()
        }
        validation /= this.queryAnswers.length
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

    delete(){
        this.validationTasks.forEach(task => {
            task.delete()
        });
        this.retrieveItemTasks.forEach(task => {
            task.delete()
        });
        this.queryAnswers = []
    }

    async deleteItem(index){
        this.queryAnswers.splice(index,1)
    }

    async run() {
        this.validated = true;
        this.validationTasks = this.queryAnswers.map(item => new ValidateRetrieveTask(this.creator, item));
        await Promise.all(this.validationTasks.map(task => task.run()));
        if (!this.isValidated()=='Validated') {
            console.warn('Retrieve Task not validated')
            return;
        }
        this.retrieveItemTasks = this.queryAnswers.map(item => new RetrieveItemTask(this.creator, item))
        await Promise.all(this.retrieveItemTasks.map(task => task.run()))
    }

}

module.exports = RetrieveTask