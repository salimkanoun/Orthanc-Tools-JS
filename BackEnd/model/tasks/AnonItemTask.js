const AbstractLeafTask = require("../AbstractLeafTask");
const OrthancQueue = require("../OrthancQueue");

//const orthanc = new Orthanc()
const orthancQueue = new OrthancQueue() 
class AnonItemTask extends AbstractLeafTask{
    constructor(creator, sourceOrthancStudyID, anonProfile, newPatientName, newPatientID, newStudyDescription, newAccessionNumber){
        super(creator)
        this.item = {
            sourceOrthancStudyID,
            anonProfile, 
            newPatientName, 
            newPatientID, 
            newStudyDescription, 
            newAccessionNumber
        }
        
    }

    async run(){
        this.job = await orthancQueue.queueAnonymizeItem(this.item)
        return this.job.finished().then((anonItemId)=>{
            this.item.anonymizedOrthancStudyID = anonItemId
            return anonItemId
        })
    }

    async getContent(){
        return {
            source: this.item.sourceOrthancStudyID,
            state: await this.getState(),
            result: this.item.anonymizedOrthancStudyID
        }
    }
}

module.exports = AnonItemTask