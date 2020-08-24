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

            //If default, remove the secondary capture SOPClassUID
            if(item.anonProfile === 'Default'){
                let anonymizedStudyDetails  = await this.orthancObject.getOrthancDetails('studies', anonAnswer.ID)
                for(let seriesOrthancID of anonymizedStudyDetails['Series']){
                    let seriesDetails = await this.orthancObject.getOrthancDetails('series', seriesOrthancID)
                    let firstInstanceID = seriesDetails['Instances'][0]
                    let sopClassUID = await this.orthancObject.getSopClassUID(firstInstanceID)
                    if(this.isSecondaryCapture(sopClassUID)){
                        await this.orthancObject.deleteFromOrthanc('series', seriesOrthancID)
                    }

                }

            }
            item.setStatus(JobItem.STATUS_SUCCESS)
        } else {
            item.setStatus(JobItem.STATUS_FAILURE)
        }

    }

    isSecondaryCapture(sopClassUid){

        let secondaryCapturySopClass = [
            "1.2.840.10008.5.1.4.1.1.7",
            "1.2.840.10008.5.1.4.1.1.7.1",
            "1.2.840.10008.5.1.4.1.1.7.2",
            "1.2.840.10008.5.1.4.1.1.7.3",
            "1.2.840.10008.5.1.4.1.1.7.4",
            "1.2.840.10008.5.1.4.1.1.88.11",
            "1.2.840.10008.5.1.4.1.1.88.22",
            "1.2.840.10008.5.1.4.1.1.88.33",
            "1.2.840.10008.5.1.4.1.1.88.40",
            "1.2.840.10008.5.1.4.1.1.88.50",
            "1.2.840.10008.5.1.4.1.1.88.59",
            "1.2.840.10008.5.1.4.1.1.88.65",
            "1.2.840.10008.5.1.4.1.1.88.67"
        ]

        return secondaryCapturySopClass.includes(sopClassUid)

    }


}

module.exports = JobAnonymize