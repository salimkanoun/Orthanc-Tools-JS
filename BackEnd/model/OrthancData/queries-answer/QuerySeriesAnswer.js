const OrthancQueryAnswer = require('./OrthancQueryAnswer')

class QuerySeriesAnswer extends OrthancQueryAnswer {
  constructor(answerId, answerNumber, studyUID, seriesUID, modality, seriesDescription, seriesNumber, originAET, numberOfSeriesRelatedInstances) {
    super(answerId, answerNumber, OrthancQueryAnswer.LEVEL_SERIES, originAET)
    this.StudyInstanceUID = studyUID
    this.SeriesInstanceUID = seriesUID
    this.Modality = modality
    this.SeriesDescription = seriesDescription
    this.SeriesNumber = seriesNumber
    this.NumberOfSeriesRelatedInstances = numberOfSeriesRelatedInstances ? parseInt(numberOfSeriesRelatedInstances) : null
  }
}

module.exports = QuerySeriesAnswer
