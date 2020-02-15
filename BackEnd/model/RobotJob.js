const RetrieveItem = require('./RetrieveItem')

class RobotJob {
  constructor (username, projectName = ['N/A']) {
    this.username = username
    this.projectName = projectName
    this.retrieveList = []
  }

  addRetrieveItem (level, patientName, patientID, studyDate, modality, studyDescription, accessionNb, aet) {
    const retrieveItem = new RetrieveItem(level, patientName, patientID, studyDate, modality, studyDescription, accessionNb, aet)
    this.retrieveList.push(retrieveItem)
  }

  getRetriveItem (index) {
    return this.retrieveList[index]
  }

  getRetrieveListSize () {
    return this.retrieveList.length
  }

  getProjectName () {
    return this.projectName
  }

  getRetrievedOrthancId () {
    const retrivedOrthancId = this.retrieveList.map(function (retrieveItem) {
      return retrieveItem.getRetrievedOrthancId()
    })

    return retrivedOrthancId
  }

  toJSON () {

    return {
      username: this.username,
      projectName: this.projectName,
      retrieveList: this.retrieveList.map( (retrieveItem) =>{
        return retrieveItem.toJSON()
      })

    }
  }
}

module.exports = RobotJob
