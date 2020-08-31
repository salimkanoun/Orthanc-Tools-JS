const JobItem = require('./JobItem')

class JobItemAnon extends JobItem{
    
    constructor(sourceOrthancStudyID, anonProfile, newPatientName, newPatientID, newStudyDescription, newAccessionNumber, originalPatientName, originalPatientID, originalStudyDescription, originalAccessionNumber ){
        super()
        this.sourceOrthancStudyID = sourceOrthancStudyID
        this.originalPatientName = originalPatientName
        this.originalPatientID = originalPatientID
        this.originalStudyDescription = originalStudyDescription
        this.originalAccessionNumber = originalAccessionNumber
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

}

module.exports = JobItemAnon