class QueryAnswer {
  constructor (answerId, 
                answerNumber, 
                level, 
                originAET, 
                patientName, 
                patientID, 
                accessionNumber, 
                modalitiesInStudy, 
                studyDescription, 
                studyInstanceUID, 
                studyDate,
                numberOfStudyRelatedSeries,
                numberOfStudyRelatedInstances,
                ) {

    this.answerId = answerId
    this.answerNumber = answerNumber
    this.level = level
    this.originAET = originAET
    this.patientName = patientName
    this.patientID = patientID
    this.accessionNumber = accessionNumber
    this.modalitiesInStudy = modalitiesInStudy
    this.studyDescription = studyDescription
    this.studyInstanceUID = studyInstanceUID
    this.studyDate = studyDate
    this.numberOfStudyRelatedSeries = numberOfStudyRelatedSeries
    this.numberOfStudyRelatedInstances = numberOfStudyRelatedInstances
    
  }
}

module.exports = QueryAnswer
