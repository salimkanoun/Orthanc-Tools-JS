const OrthancQueryAnswers = require('./OrthancQueryAnswer')

class QuerySerieAnswer extends OrthancQueryAnswers {

  constructor (answerId, answerNumber, level, studyUID, seriesUID, modality, seriesDescription, seriesNumber, originAET, numberOfSeriesRelatedInstances) {
    super(answerId,answerNumber,level,originAET,numberOfSeriesRelatedInstances)
    this.studyInstanceUID = studyUID
    this.serieInstanceUID = seriesUID
    this.modality = modality
    this.serieDescription = seriesDescription
    this.serieNumber = seriesNumber
  }
  
}

module.exports = QuerySerieAnswer
