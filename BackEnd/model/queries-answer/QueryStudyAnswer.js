const OrthancQueryAnswer = require('./OrthancQueryAnswer')

class QueryStudyAnswer extends OrthancQueryAnswer {
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
    numberOfStudyRelatedInstances
  ) {
    super(answerId, answerNumber, OrthancQueryAnswer.LEVEL_STUDY , originAET, numberOfStudyRelatedInstances)
    this.patientName = patientName
    this.patientID = patientID
    this.accessionNumber = accessionNumber
    this.modalitiesInStudy = modalitiesInStudy
    this.studyDescription = studyDescription
    this.studyInstanceUID = studyInstanceUID
    this.studyDate = studyDate
    this.numberOfStudyRelatedSeries = numberOfStudyRelatedSeries
  }
}

module.exports = QueryStudyAnswer
