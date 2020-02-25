class RetrieveItem {

  constructor (level, patientName, patientId, studyDate, modality, studyDescription, accessionNb, aet) {
    this.level = level
    this.patientName = patientName
    this.patientId = patientId
    this.studyDate = studyDate
    this.modality = modality
    this.studyDescription = studyDescription
    this.accessionNb = accessionNb
    this.aet = aet
    this.status = RetrieveItem.STATUS_IDLE
  }

  setRetrievedOrthancId (orthancId) {
    this.retrievedOrthancId = orthancId
  }

  getRetrievedOrthancId () {
    return this.retrievedOrthancId
  }

  setStatus(status){
    this.status = status
  }

  getStatus(){
    return this.status
  }


  toJSON () {
    return {
      level: this.level,
      patientName: this.patientName,
      patientId: this.patientId,
      studyDate: this.studyDate,
      modality: this.modality,
      studyDescription: this.studyDescription,
      accessionNb: this.accessionNb,
      aet: this.aet,
      status : this.status
    }
  }
}

RetrieveItem.STATUS_IDLE = 'Idle';
RetrieveItem.STATUS_RETRIVING = 'Retrieving';
RetrieveItem.STATUS_RETRIEVED = 'Retrieved';
RetrieveItem.STATUS_FAILURE = 'Failure';

module.exports = RetrieveItem
