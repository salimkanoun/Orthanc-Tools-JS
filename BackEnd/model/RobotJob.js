const RetrieveItem = require('./RetrieveItem')

class RobotJob {
  constructor (username, projectName = ['N/A']) {
    this.username = username
    this.projectName = projectName
    this.retrieveList = []
    this.validated = false
  }

  getProgression () {
    let totalRetrievedCount = 0
    let totalInstanceCount = 0
    let totalFailedCount = 0

    this.retrieveList.forEach((retrieveItem) => {
      const numberOfInstance = retrieveItem.getNumberOfInstances()
      const itemStatus = retrieveItem.getStatus()
      totalInstanceCount += numberOfInstance

      if (itemStatus === RetrieveItem.STATUS_RETRIEVED) {
        totalRetrievedCount += numberOfInstance
      } else if (itemStatus === RetrieveItem.STATUS_FAILURE) {
        totalFailedCount += numberOfInstance
      }
    })
    return {
      totalInstances: totalInstanceCount,
      retrievedInstances: totalRetrievedCount,
      failedInstances: totalFailedCount
    }
  }

  isValidated () {
    return this.validated
  }

  validateJobIfAllItemValidated () {
    const nonValidatedItems = this.retrieveList.filter((retrieveItem) => {
      return !retrieveItem.validated
    })

    if (nonValidatedItems.length === 0) {
      this.setValidated()
    }
  }

  setValidated () {
    this.validated = true
  }

  addRetrieveItem (level, patientName, patientID, studyDate, modality, studyDescription, accessionNb, studyInstanceUID, aet) {
    const retrieveItem = new RetrieveItem(level, patientName, patientID, studyDate, modality, studyDescription, accessionNb, studyInstanceUID, aet)
    this.retrieveList.push(retrieveItem)
  }

  getRetriveItem (index) {
    return this.retrieveList[index]
  }

  getAllRetrieveItems () {
    return this.retrieveList
  }

  removeRetrieveItem (index) {
    this.retrieveList.splice(index, 1)
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
      retrieveList: this.retrieveList.map((retrieveItem) => {
        return retrieveItem.toJSON()
      }),
      ...this.getProgression()

    }
  }
}

module.exports = RobotJob
