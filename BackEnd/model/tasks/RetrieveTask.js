const AbstractTask = require("../AbstractTask");
const RetrieveItemTask = require("./RetrieveItemTask");
const ValidateRetrieveTask = require("./ValidateRetrieveTask");

class RetrieveTask extends AbstractTask {
    constructor(creator, projectName, querryAnswers, target) {
        super(creator, 'retrieve')

        this.projectName = projectName
        this.querryAnswers = querryAnswers

        this.validationTasks = []
        this.retrieveItemTasks = []
    }

    async getProgress() {
        let validation = 0
        for (let i = 0; i < this.validationTasks.length; i++) {
            const task = this.validationTasks[i]
            validation += await task.getProgress()
        }
        validation /= this.querryAnswers.length
        let retrieve = 0
        for (let i = 0; i < this.retrieveItemTasks.length; i++) {
            const task = this.retrieveItemTasks[i]
            retrieve += await task.getProgress()
        }
        retrieve /= this.querryAnswers.length
        
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
        let validated = true;
        this.validationTasks.forEach(task => {
            validated = validated && task.validated;
        });
        return validated;
    }

    async getContent() {
        let items = []
        for (let i = 0; i < this.querryAnswers.length; i++) {
            let item = {
                ...( this.retrieveItemTasks[i]?await this.retrieveItemTasks[i].getContent():this.querryAnswers[i]),
                Validated:this.validationTasks[i].validated,
                Status: ( this.retrieveItemTasks[i]?await this.retrieveItemTasks[i].getState():'waiting')
            }
            items.push(item)   
        } 
        return{
            projectName : this.projectName,
            items
        }
    }

    async run() {
        this.validationTasks = this.querryAnswers.map(item => new ValidateRetrieveTask(this.creator, item));
        await Promise.all(this.validationTasks.map(task => task.run()));
        if (!this.isValidated()) {
            console.warn('Retrieve Task not validated')
            return;
        }
        this.retrieveItemTasks = this.querryAnswers.map(item => new RetrieveItemTask(this.creator, item))
        await Promise.all(this.retrieveItemTasks.map(task => task.run()))
    }
}

module.exports = RetrieveTask