class OrthancQueryAnswer {
  constructor (answerId, answerNumber, level, originAET, numberOfSeriesRelatedInstances) {
    this.answerId = answerId
    this.answerNumber = answerNumber
    this.level = level
    this.originAET = originAET
    this.numberOfSeriesRelatedInstances = numberOfSeriesRelatedInstances
  }
}

OrthancQueryAnswer.LEVEL_SERIES = 'series'
OrthancQueryAnswer.LEVEL_STUDY ='study'

module.exports = OrthancQueryAnswer
