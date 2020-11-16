const AbstractTask = require("../AbstractTask");
const OrthancQueue = require("../OrthancQueue");
const orthancQueue = new OrthancQueue()

class DeleteTask extends AbstractTask{
    constructor(creator, orthancSeriesIds){
        super(creator, 'delete')
        this.orthancSeriesIds = orthancSeriesIds
        this.jobs = [];
    }

    async getProgress(){
        let completed = 0
        for (let i = 0; i < this.jobs.length; i++) {
            const item = this.jobs[i];
            if(await item.getState()==='completed') completed++
        }
        return completed/this.orthancSeriesIds.length*100
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

    async run(){
        this.jobs = await orthancQueue.queueDeleteItems(this.orthancSeriesIds)
        await Promise.all(this.jobs.map(job=>job.finished()))
    }
}

module.exports = DeleteTask