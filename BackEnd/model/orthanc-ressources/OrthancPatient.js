const OrthancStudy = require('./OrthancStudy')

/**
 * Stores a patient level Orthanc ressource
 */
class OrthancPatient {
  constructor (patientOrthancID, orthancInstance) {
    this.patientOrthancID = patientOrthancID
    this.orthancInstance = orthancInstance
  }

  /**
     * Fill data from /patient API
     * @param {function()} returnCallBack
     */
  fillDetails () {
    const self = this
    return this.orthancInstance.getOrthancDetails('patients', this.patientOrthancID).then(function (answer) {
      for (const element in answer) {
        self[element] = answer[element]
      }
      self.getStudies()
      return self
    }).catch((error) => { console.log('Error getting patient details ' + error) })
  }

  fillStudiesDetails () {
    const getStudiesPromises = []
    this.studiesObjects.forEach(studyObject => {
      getStudiesPromises.push(studyObject.fillDetails())
    })
    return Promise.all(getStudiesPromises)
  }

  async fillAllChildsDetails () {
    await this.fillDetails()
    await this.fillStudiesDetails()

    const allSeriesPromises = []
    this.studiesObjects.forEach(study => {
      allSeriesPromises.push(study.fillSeriesDetails())
    })

    await Promise.all(allSeriesPromises)
  };

  /**
     * Store references of child Study object
     */
  getStudies () {
    const self = this
    const studiesObjects = []
    this.Studies.forEach(element => {
      studiesObjects.push(new OrthancStudy(element, self.orthancInstance))
    })
    this.studiesObjects = studiesObjects
  }
}

module.exports = OrthancPatient
