const OrthancQueryAnswer = require('./OrthancQueryAnswer')

class QuerySeriesAnswer extends OrthancQueryAnswer {
  constructor(answerId, answerNumber, patientName, patientID, studyDescription, studyDate, accessionNumber, requestedProcedureDescription, studyUID, seriesUID, modality, seriesDescription, seriesNumber, originAET, numberOfSeriesRelatedInstances) {
    super(answerId, answerNumber, OrthancQueryAnswer.LEVEL_SERIES, originAET)
    this.PatientName = patientName
    this.PatientID = patientID
    this.StudyDescription = studyDescription
    this.StudyDate = studyDate
    this.AccessionNumber = accessionNumber
    this.RequestedProcedureDescription = requestedProcedureDescription,
    this.StudyInstanceUID = studyUID
    this.SeriesInstanceUID = seriesUID
    this.Modality = modality
    this.SeriesDescription = seriesDescription
    this.SeriesNumber = seriesNumber
    this.NumberOfSeriesRelatedInstances = numberOfSeriesRelatedInstances ? parseInt(numberOfSeriesRelatedInstances) : null
  }
}

module.exports = QuerySeriesAnswer
