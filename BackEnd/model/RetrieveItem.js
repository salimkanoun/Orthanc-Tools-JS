class RetrieveItem {

  constructor (queryAnswer) {
    this.queryAnswer = queryAnswer
    this.validated = false
    this.status = RetrieveItem.STATUS_IDLE
    this.retrievedOrthancId = null
  }

  getQueryAnswer(){
    return this.queryAnswer
  }

  async validateRetrieveItem(orthancObject){

    if(this.queryAnswer.level === OrthancQueryAnswer.LEVEL_STUDY){    
        orthancObject.buildStudyDicomQuery('', '', '', '', '', '', this.queryAnswer.studyInstanceUID)
    }else if(this.queryAnswer.level === OrthancQueryAnswer.LEVEL_STUDY){
        orthancObject.buildSeriesDicomQuery(this.queryAnswer.studyInstanceUID, '', '', '', '', this.queryAnswer.seriesInstanceUID)
    }
   
    const answerDetails = await this.orthancObject.makeDicomQuery(this.queryAnswer.aet)

    if (answerDetails.length === 1) {
      this.setValidated()
      this.setNumberOfSeries(answerDetails[0].numberOfStudyRelatedSeries)
      this.setNumberOfInstances(answerDetails[0].numberOfSeriesRelatedInstances)
      return true
    }else{
      return false
    }

  }

  async doRetrieveItem(orthancObject){

    if(!this.validated){
      throw "Non Validated Item"
    }
    
    this.setStatus(RetrieveItem.STATUS_RETRIVING)

    if(this.queryAnswer.level === OrthancQueryAnswer.LEVEL_STUDY){    
      orthancObject.buildStudyDicomQuery('', '', '', '', '', '', this.queryAnswer.studyInstanceUID)
    }else if(this.queryAnswer.level === OrthancQueryAnswer.LEVEL_STUDY){
        orthancObject.buildSeriesDicomQuery(this.queryAnswer.studyInstanceUID, '', '', '', '', this.queryAnswer.seriesInstanceUID)
    }


    const answerDetails = await orthancObject.makeDicomQuery(this.queryAnswer.aet)

    const answer = answerDetails[0]
    const retrieveAnswer = await this.orthancObject.makeRetrieve(answer.answerId, answer.answerNumber, this.aetDestination, true)
    const orthancResults = await this.orthancObject.findInOrthancByUid(retrieveAnswer.Query[0]['0020,000d'])
    if (orthancResults.length === 1) {
      this.setStatus(RetrieveItem.STATUS_RETRIEVED)
      this.setRetrievedOrthancId(orthancResults[0].ID)
    } else {
      this.setStatus(RetrieveItem.STATUS_FAILURE)
    }

  }

  setValidated () {
    this.validated = true
  }

  setNumberOfInstances (number) {
    this.numberOfInstances = parseInt(number)
  }

  getNumberOfInstances () {
    return this.numberOfInstances
  }

  setRetrievedOrthancId (orthancId) {
    this.retrievedOrthancId = orthancId
  }

  getRetrievedOrthancId () {
    return this.retrievedOrthancId
  }

  setStatus (status) {
    this.status = status
  }

  getStatus () {
    return this.status
  }

  toJSON () {
    return {
      level: this.level,
      ...this.queryAnswer,
      validated : this.validated,
      retrievedOrthancId : this.retrievedOrthancId,
      status: this.status
    }
  }

}

RetrieveItem.STATUS_IDLE = 'Idle'
RetrieveItem.STATUS_RETRIVING = 'Retrieving'
RetrieveItem.STATUS_RETRIEVED = 'Retrieved'
RetrieveItem.STATUS_FAILURE = 'Failure'

module.exports = RetrieveItem
