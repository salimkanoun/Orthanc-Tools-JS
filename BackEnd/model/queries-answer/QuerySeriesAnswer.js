const OrthancQueryAnswer = require('./OrthancQueryAnswer')

class QuerySeriesAnswer extends OrthancQueryAnswer {
  constructor (answerId, answerNumber, studyUID, seriesUID, modality, seriesDescription, seriesNumber, originAET, numberOfSeriesRelatedInstances) {
    super(answerId, answerNumber, OrthancQueryAnswer.LEVEL_SERIES, originAET, numberOfSeriesRelatedInstances)
    this.studyInstanceUID = studyUID
    this.seriesInstanceUID = seriesUID
    this.modality = modality
    this.seriesDescription = seriesDescription
    this.seriesNumber = seriesNumber
  }
}

module.exports = QuerySeriesAnswer
