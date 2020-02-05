class QuerySerieAnswer {

    constructor (studyUID, seriesUID, modality, seriesDescription, seriesNumber, originAET) {
      this.studyInstanceUID = studyUID
      this.serieInstanceUID = seriesUID
      this.modality = modality
      this.serieDescription = seriesDescription
      this.serieNumber = seriesNumber
      this.originAET = originAET
    }
  
  }
  
  module.exports = QuerySerieAnswer
  