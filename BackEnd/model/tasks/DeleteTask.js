const AbstractTask = require("../AbstractTask");
const OrthancQueue = require("../OrthancQueue");
const orthancQueue = new OrthancQueue()

class DeleteTask extends AbstractTask{
    constructor(creator, orthancSeriesIds){
        super(creator)
        this.orthancSeriesIds = orthancSeriesIds
        this.jobs = [];
    }

    async getProgress(){
        let completed = 0
        for (let i = 0; i < jobs.length; i++) {
            const item = jobs[i];
            if(await item.getState()==='complete') complete++
        }
        return completed/this.orthancSeriesIds.length()
    }

    async getState(){
        if(await this.getProgress()===0) {
            return 'wait'
        }else if(await this.getProgress()===100) {
            return 'complete'
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