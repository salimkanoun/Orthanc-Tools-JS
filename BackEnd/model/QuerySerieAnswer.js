class QuerySerieAnswer {
  constructor (answerId, answerNumber, level, studyUID, seriesUID, modality, seriesDescription, seriesNumber, originAET, numberOfSeriesRelatedInstances) {
    this.answerId = answerId
    this.answerNumber = answerNumber
    this.level = level
    this.studyInstanceUID = studyUID
    this.serieInstanceUID = seriesUID
    this.modality = modality
    this.serieDescription = seriesDescription
    this.serieNumber = seriesNumber
    this.originAET = originAET,
    this.numberOfSeriesRelatedInstances = numberOfSeriesRelatedInstances
  }
}

module.exports = QuerySerieAnswer
