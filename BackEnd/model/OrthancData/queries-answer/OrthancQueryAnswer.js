class OrthancQueryAnswer {
  constructor (answerId, answerNumber, level, originAET, numberOfSeriesRelatedInstances) {
    this.AnswerId = answerId
    this.AnswerNumber = answerNumber
    this.Level = level
    this.OriginAET = originAET
    this.NumberOfSeriesRelatedInstances = parseInt(numberOfSeriesRelatedInstances)
  }
}

OrthancQueryAnswer.LEVEL_SERIES = 'series'
OrthancQueryAnswer.LEVEL_STUDY ='study'

module.exports = OrthancQueryAnswer
