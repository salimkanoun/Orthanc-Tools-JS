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

    toJSON(){
        return {
            level : this.level,
            patientName : this.patientName,
            patientId : this.patientId,
            studyDate : this.studyDate,
            modality : this.modality,
            studyDescription : this.studyDescription,
            accessionNb : this.accessionNb
        }
    }
    
}

module.exports = Retrieve_Item