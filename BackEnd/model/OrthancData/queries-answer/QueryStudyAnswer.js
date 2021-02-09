const OrthancQueryAnswer = require('./OrthancQueryAnswer')

class QueryStudyAnswer extends OrthancQueryAnswer {
  constructor (answerId,
    answerNumber,
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
    requestedProcedureDescription
  ) {
    super(answerId, answerNumber, OrthancQueryAnswer.LEVEL_STUDY , originAET, numberOfStudyRelatedInstances)
    this.PatientName = patientName
    this.PatientID = patientID
    this.AccessionNumber = accessionNumber
    this.ModalitiesInStudy = modalitiesInStudy
    this.StudyDescription = studyDescription
    this.StudyInstanceUID = studyInstanceUID
    this.StudyDate = studyDate
    this.NumberOfStudyRelatedSeries = numberOfStudyRelatedSeries
    this.RequestedProcedureDescription = requestedProcedureDescription
  }
}

module.exports = QueryStudyAnswer
