class Retrieve_Item{

    constructor(level, patientName, patientId, studyDate, modality, studyDescription, accessionNb){
        this.level = level
        this.patientName = patientName
        this.patientId = patientId
        this.studyDate = studyDate
        this.modality = modality
        this.studyDescription = studyDescription
        this.accessionNb = accessionNb
    }

    setRetrievedOrthancId(orthancId){
        this.retrievedOrthancId=orthancId
    }
    
}

module.exports = Retrieve_Item