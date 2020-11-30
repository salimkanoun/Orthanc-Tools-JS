const AbstractTask = require("../AbstractTask");
const AnonItemTask = require("./AnonItemTask");

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

    async run(){
        await Promise.all(this.itemTasks.map(task=>task.run()))
    }
}

module.exports = AnonTask