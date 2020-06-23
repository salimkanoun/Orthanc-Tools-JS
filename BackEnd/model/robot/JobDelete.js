const Job = require('./Job')
const JobItem  = require('./JobItem')

class JobDelete extends Job {

    constructor(username, orthancObject){
        super(username, Job.TYPE_DELETE, orthancObject)
    }

    async execute(){
        this.status = Job.STATUS_RUNNING
        for (let item of this.items) {
            try{
                await this.orthancObject.deleteFromOrthanc('series', item.seriesOrthancID)
                item.setStatus(JobItem.STATUS_SUCCESS)
            }catch (err){
                item.setStatus(JobItem.STATUS_FAILURE)
            }

        }
        this.status = Job.STATUS_FINISHED
    }

}

module.exports = JobDelete