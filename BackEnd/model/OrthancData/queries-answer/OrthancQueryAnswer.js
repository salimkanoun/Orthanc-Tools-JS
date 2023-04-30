class OrthancQueryAnswer {
  constructor (answerId, answerNumber, level, originAET) {
    this.AnswerId = answerId
    this.AnswerNumber = answerNumber
    this.Level = level
    this.OriginAET = originAET
  }
}

OrthancQueryAnswer.LEVEL_SERIES = 'series'
OrthancQueryAnswer.LEVEL_STUDY ='study'

module.exports = OrthancQueryAnswer
