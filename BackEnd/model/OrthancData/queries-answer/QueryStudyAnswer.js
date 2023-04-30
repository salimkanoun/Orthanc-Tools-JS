const OrthancQueryAnswer = require('./OrthancQueryAnswer')

class QueryStudyAnswer extends OrthancQueryAnswer {
  constructor(answerId,
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
    super(answerId, answerNumber, OrthancQueryAnswer.LEVEL_STUDY, originAET)
    this.PatientName = patientName
    this.PatientID = patientID
    this.AccessionNumber = accessionNumber
    this.ModalitiesInStudy = modalitiesInStudy
    this.StudyDescription = studyDescription
    this.StudyInstanceUID = studyInstanceUID
    this.StudyDate = studyDate
    this.RequestedProcedureDescription = requestedProcedureDescription
    this.NumberOfStudyRelatedSeries = numberOfStudyRelatedSeries ? parseInt(numberOfStudyRelatedSeries) : null
    this.NumberOfStudyRelatedInstances = numberOfStudyRelatedInstances ? parseInt(numberOfStudyRelatedInstances) : null
  }
}

module.exports = QueryStudyAnswer
