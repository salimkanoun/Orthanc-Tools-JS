const Job = require('./Job')
const JobItem = require('./JobItem')

class JobAnonymize extends Job {

    constructor(username, orthancObject) {
        super(Job.TYPE_ANONYMIZE, username, orthancObject)
    }

    async execute() {
        this.status = Job.STATUS_RUNNING
        for (let item of this.items) {
            await this.doAnonItem(item)
        }
        this.status = Job.STATUS_FINISHED
    }

    async doAnonItem(item) {
        item.setStatus(JobItem.STATUS_RUNNING)
        let anonAnswer = await this.orthancObject.makeAnon('studies', item.sourceOrthancStudyID, item.anonProfile, item.newAccessionNumber, item.newPatientID, item.newPatientName, item.newStudyDescription, true)
        if (anonAnswer.ID !== undefined) {
            item.setAnonymizedOrthancStudyID(anonAnswer.ID)
            item.setStatus(JobItem.STATUS_SUCCESS)
        } else {
            item.setStatus(JobItem.STATUS_FAILURE)
        }

    }

}

module.exports = JobAnonymize