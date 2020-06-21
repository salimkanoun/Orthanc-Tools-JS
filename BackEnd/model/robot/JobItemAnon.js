const JobItem = require('./JobItem')

class JobItemAnon extends JobItem{
    
    constructor(sourceOrthancStudyID, anonProfile, newPatientName, newPatientID, newStudyDescription, newAccessionNumber){
        super()
        this.sourceOrthancStudyID = sourceOrthancStudyID
        this.anonProfile = anonProfile
        this.newPatientName = newPatientName
        this.newPatientID = newPatientID
        this.newStudyDescription = newStudyDescription
        this.newAccessionNumber = newAccessionNumber
    }

    setAnonymizedOrthancStudyID(studyID){
        this.anonymizedOrthancStudyID = studyID
    }

    getAnonymizedOrthancStudyID(){
        return this.anonymizedOrthancStudyID
    }

    toJSON(){
        return {
            ...this
        }
    }

}

module.exports = JobItemAnon