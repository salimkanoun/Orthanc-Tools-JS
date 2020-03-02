const Options = require('./Options')
const request = require('request-promise-native')
const OriginalRequest = require('request')
const fs = require('fs')
const QueryStudyAnswer = require('./queries-answer/QueryStudyAnswer')
const QuerySerieAnswer = require('./queries-answer/QuerySerieAnswer')
const TagAnon = require('./TagAnon')
const ReverseProxy = require('./ReverseProxy')

/**
 * Orthanc object to communications with orthanc server
 */
class Orthanc {
  constructor () {
    let orthancSettings = Options.getOrthancConnexionSettings()
    this.address = orthancSettings['OrthancAdress']
    this.port = orthancSettings['OrthancPort']
    this.username = orthancSettings['OrthancUsername']
    this.password = orthancSettings['OrthancPassword']
  }

  /**
     * return orthanc connection string
     */
  getOrthancAdressString () {
    return (this.address + ':' + this.port)
  }

  /**
     * Generate option object for Request
     * Private Method
     * @param {string} method
     * @param {string} url
     * @param {string} data in JSON
     */
  _createOptions (method, url, data = 'none') {
    const serverString = this.getOrthancAdressString() + url

    let options = null
    if (method === 'GET' || method === 'DELETE') {
      options = {
        method: method,
        url: serverString,
        auth: {
          user: this.username,
          password: this.password
        }
      }
    } else {
      options = {
        method: method,
        url: serverString,
        auth: {
          user: this.username,
          password: this.password
        },
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        },
        body: data
      }
    }

    return options
  }

  /**
     * Return /System API data
     */
  async getOrthancAetName () {
    const self = this
    const requestPromise = request.get(self._createOptions('GET', '/system')).then(function (body) {
      return self._answerParser(body)
    }).then(answer => answer.DicomAet).catch((error) => { console.log('Error Get System ' + error) })

    return requestPromise
  }

  /**
     * Add DICOM Peer modality to Orthanc
     * @param {string} name
     * @param {string} aet
     * @param {string} ip
     * @param {number} port
     * @param {string} type
     */
  putAet (name, aet, ip, port, type) {
    let data = []
    if (type === undefined) {
      data = [aet, ip, port]
    } else {
      data = [aet, ip, port, type]
    }
    const self = this

    const requestPromise = request.put(self._createOptions('PUT', '/modalities/' + name, JSON.stringify(data))).then(function (body) {
      return true
    }).catch((error) => { console.log('Error put AET ' + error) })

    return requestPromise
  }

  /**
     * Export an orthanc ressource to Export folder in hierachical ZIP
     * @param {array} orthancIds
     * @param {string} filename
     */
  exportArchiveDicom (orthancIds, filename) {
    const destination = './data/export_dicom/' + filename + '.zip'
    const streamWriter = fs.createWriteStream(destination)
    // Can't use request promise at the pipe is unsafe, use the stantard request library
    OriginalRequest.post(this._createOptions('POST', '/tools/create-archive', JSON.stringify(orthancIds)))
      .on('response', function (response) {
        console.log(response.statusCode + 'Writing started') // 200
      })
      .pipe(streamWriter)
      .on('finish', function () { console.log('Writing Done') })
  }

  /**
     * Parse recieved answer
     * @param {string} answer
     */
  _answerParser (answer) {
    let parsedAnwser = []
    try {
      parsedAnwser = JSON.parse(answer)
    } catch (error) {
      console.error('Parsing Response Error answer : ' + answer + ' Thrown Error : ' + error)
    }
    return parsedAnwser
  }

  /**
     * Prepare JSON query for DICOM query request in Orthanc
     * @param {string} level
     * @param {string} patientName
     * @param {string} patientID
     * @param {string} studyDate
     * @param {string} modality
     * @param {string} studyDescription
     * @param {string} accessionNb
     */
  buildDicomQuery (level = 'Study', patientName = '', patientID = '', studyDate = '', modality = '', studyDescription = '', accessionNb = '', studyInstanceUID = '') {
    if (patientName === '*^*') patientName = '*'
    // Remove * character as until date X should be written -dateX and not *-dateX
    studyDate = studyDate.replace(/[*]/g, '')

    if (studyDate === '-') studyDate = '*'

    this.preparedQuery = {
      Level: level,
      Query: {
        PatientName: patientName,
        PatientID: patientID,
        StudyDate: studyDate,
        ModalitiesInStudy: modality,
        StudyDescription: studyDescription,
        AccessionNumber: accessionNb,
        StudyInstanceUID: studyInstanceUID,
        NumberOfStudyRelatedInstances: '',
        NumberOfStudyRelatedSeries: ''
      }

    }
  }

  /**
     * Make Query on AET an return response path location
     * @param {String} aet
     */
  makeDicomQuery (aet) {
    const self = this
    const queryPromise = request.post(self._createOptions('POST', '/modalities/' + aet + '/query', JSON.stringify(self.preparedQuery))).then(function (body) {
      const answer = self._answerParser(body)
      return answer
    }).then(function (answer) {
      const answerDetails = self.getAnswerDetails(answer.ID, aet)
      return answerDetails
    }).catch((error) => { console.log('Error Making Study Query ' + error) })

    return queryPromise
  }

  querySeries (aet, studyUID) {
    const currentOrthanc = this

    const query = {
      Level: 'Series',
      Query: {
        Modality: '',
        ProtocolName: '',
        SeriesDescription: '',
        SeriesInstanceUID: '',
        StudyInstanceUID: studyUID,
        SeriesNumber: '',
        SeriesInstanceUID: '',
        NumberOfSeriesRelatedInstances: ''
      },
      Normalize: false
    }

    const requestAnswer = request.post(currentOrthanc._createOptions('POST', '/modalities/' + aet + '/query', JSON.stringify(query))).then(function (body) {
      const answer = currentOrthanc._answerParser(body)
      return answer
    }).then(function (answer) {
      const answerDetails = currentOrthanc.getSeriesAnswerDetails(answer.ID, aet)
      return answerDetails
    }).catch((error) => {
      return new Error('Error Querying series' + error)
    })

    return requestAnswer
  }

  getSeriesAnswerDetails (answerId, aet) {
    const self = this

    const promiseRequest = request.get(self._createOptions('GET', '/queries/' + answerId + '/answers?expand')).then(function (body) {
      const answersObjects = []
      try {
        const answersList = self._answerParser(body)

        answersList.forEach(element => {
          let answerNumber = 0

          const queryLevel = element['0008,0052'].Value

          let Modality = '*'
          if (element.hasOwnProperty('0008,0060')) {
            Modality = element['0008,0060'].Value
          }

          let SeriesDescription = '*'
          if (element.hasOwnProperty('0008,103e')) {
            SeriesDescription = element['0008,103e'].Value
          }

          let StudyInstanceUID = '*'
          if (element.hasOwnProperty('0020,000d')) {
            StudyInstanceUID = element['0020,000d'].Value
          }

          let SeriesInstanceUID = '*'
          if (element.hasOwnProperty('0020,000e')) {
            SeriesInstanceUID = element['0020,000e'].Value
          }

          let SeriesNumber = 0
          if (element.hasOwnProperty('0020,0011')) {
            SeriesNumber = element['0020,0011'].Value
          }

          let numberOfSeriesRelatedInstances = 'N/A'
          if (element.hasOwnProperty('0020,1209')) {
            numberOfSeriesRelatedInstances = element['0020,1209'].Value
          }

          const originAET = aet
          const queryAnswserObject = new QuerySerieAnswer(answerId, answerNumber, queryLevel, StudyInstanceUID, SeriesInstanceUID, Modality, SeriesDescription, SeriesNumber, originAET, numberOfSeriesRelatedInstances)
          answersObjects.push(queryAnswserObject)
          answerNumber++
        })
      } catch (exception) {
        console.log('error' + exception)
      }
      return answersObjects
    }).catch((error) => { console.log('Error get answers series Details ' + error) })

    return promiseRequest
  }

  getAnswerDetails (answerId, aet) {
    const self = this
    const queryPromise = request.get(self._createOptions('GET', '/queries/' + answerId + '/answers?expand')).then(function (body) {
      const answersObjects = []
      try {
        const answersList = self._answerParser(body)
        let answerNumber = 0

        answersList.forEach(element => {
          const queryLevel = element['0008,0052'].Value

          let accessionNb = '*'
          if (element.hasOwnProperty('0008,0050')) {
            accessionNb = element['0008,0050'].Value
          }

          let studyDate = '*'
          if (element.hasOwnProperty('0008,0020')) {
            studyDate = element['0008,0020'].Value
          }

          let studyDescription = '*'
          if (element.hasOwnProperty('0008,1030')) {
            studyDescription = element['0008,1030'].Value
          }

          let patientName = '*'
          if (element.hasOwnProperty('0010,0010')) {
            patientName = element['0010,0010'].Value
          }

          let patientID = '*'
          if (element.hasOwnProperty('0010,0020')) {
            patientID = element['0010,0020'].Value
          }

          let studyUID = '*'
          if (element.hasOwnProperty('0020,000d')) {
            studyUID = element['0020,000d'].Value
          }

          let numberOfStudyRelatedSeries = 'N/A'
          if (element.hasOwnProperty('0020,1206')) {
            numberOfStudyRelatedSeries = element['0020,1206'].Value
          }

          let numberOfStudyRelatedInstances = 'N/A'
          if (element.hasOwnProperty('0020,1208')) {
            numberOfStudyRelatedInstances = element['0020,1208'].Value
          }

          let modalitiesInStudy = '*'
          // Modalities in studies not always present
          if (element.hasOwnProperty('0008,0061')) {
            modalitiesInStudy = element['0008,0061'].Value
          }
          const origineAET = aet
          const queryAnswserObject = new QueryStudyAnswer(answerId, answerNumber, queryLevel, origineAET, patientName, patientID, accessionNb, modalitiesInStudy, studyDescription, studyUID, studyDate, numberOfStudyRelatedSeries, numberOfStudyRelatedInstances)
          answersObjects.push(queryAnswserObject)
          answerNumber++
        })
      } catch (exception) {
        console.log('error' + exception)
      }
      return answersObjects
    }).catch((error) => { console.log('Error get answers Details ' + error) })

    return queryPromise
  }

  /**
     * retrieve a qurey answer to an AET
     * return the JobID of the retrieve call
     * @param {QueryAnswer} queryAnswerObject
     * @param {string} aet
     */
  makeRetrieve (queryID, answerNumber, aet, synchronous = false) {
    const self = this
    const postData = {
      Synchronous: synchronous,
      TargetAet: aet
    }

    const requestPromise = request.post(self._createOptions('POST', '/queries/' + queryID + '/answers/' + answerNumber + '/retrieve', JSON.stringify(postData))).then(function (body) {
      return (self._answerParser(body))
    }).catch((error) => { console.log('Error make retrieve ' + error) })

    return requestPromise
  }

  getJobData (jobUid) {
    const self = this
    const requestPromise = request.get(self._createOptions('GET', '/jobs/' + jobUid)).then(function (body) {
      const answer = self._answerParser(body)
      const queryDetails = answer.Content.Query
      const remoteAET = queryDetails.RemoteAet
      const answerObject = []
      try {
        queryDetails.forEach(queryData => {
          const retrieveDetails = {
            accessionNb: queryData['0008,0050'],
            level: queryData['0008,0052'],
            patientID: queryData['0010,0020'],
            studyUID: queryData['0020,000d'],
            remoteAet: remoteAET
          }
          answerObject.push(retrieveDetails)
        })
      } catch (exception) {};
      return answer
    }).catch((error) => { console.log('Error get job Details ' + error) })

    return requestPromise
  }

  /**
     * Search for content in Orthanc
     * @param {string} level
     * @param {string} patientName
     * @param {string} patientID
     * @param {string} accessionNb
     * @param {string} date
     * @param {string} studyDescription
     * @param {string} modality
     */
  findInOrthanc (level = 'Study', patientName = '*', patientID = '*', accessionNb = '*', date = '*', studyDescription = '*', modality = '*') {
    const currentOrthanc = this
    const queryDetails = {}

    if (date !== '*') queryDetails.StudyDate = date
    if (studyDescription !== '*') queryDetails.StudyDescription = studyDescription
    if (modality !== '*') queryDetails.ModalitiesInStudy = modality
    if (patientName !== '*') queryDetails.PatientName = patientName
    if (patientID !== '*') queryDetails.PatientID = patientID
    if (accessionNb !== '*') queryDetails.AccessionNumber = accessionNb

    const queryParameter = {
      Level: level,
      CaseSensitive: false,
      Expand: true,
      Query: queryDetails
    }

    const promiseRequest = request.post(currentOrthanc._createOptions('POST', '/tools/find', JSON.stringify(queryParameter))).then(function (body) {
      const answer = currentOrthanc._answerParser(body)
      return answer
    }).catch((error) => { console.log('Error find in Orthanc ' + error) })

    return promiseRequest
  }

  /**
     * Find Orthanc study ID by dicom StudyInstanceUID
     * @param {string} studyUID
     */
  findInOrthancByUid (studyUID) {
    const self = this

    const queryParameter = {
      Level: 'Study',
      Query: {
        StudyInstanceUID: studyUID
      }
    }

    const requestPromise = request.post(self._createOptions('POST', '/tools/find', JSON.stringify(queryParameter))).then(function (body) {
      const answer = self._answerParser(body)
      return answer
    }).catch((error) => { console.log('Error find In Orthanc ' + error) })

    return requestPromise
  }

  /**
     * Return details of the patients, studies, series GET API
     * @param {string} level
     * @param {string} orthancID
     */
  getOrthancDetails (level, orthancID) {
    const self = this
    const requestPromise = request.get(self._createOptions('GET', '/' + level + '/' + orthancID)).then(function (body) {
      const answer = self._answerParser(body)
      return answer
    }).catch((error) => { console.log('Error get Orthanc level details ' + error) })

    return requestPromise
  }

  /**
     * Delete a ressource in Orthanc
     * @param {string} level
     * @param {string} orthancID
     */
  deleteFromOrhtanc (level, orthancID) {
    const self = this
    const requestPromise = request.delete(self._createOptions('DELETE', '/' + level + '/' + orthancID))
      .catch((error) => { console.log('Error delete from Orthanc ' + error) })
    return requestPromise
  }

  /**
     * Prepare Anon Query in Orthanc
     * @param {string} profile
     * @param {string} newAccessionNumber
     * @param {string} newPatientID
     * @param {string} newPatientName
     * @param {string} newStudyDescription
     */
  buildAnonQuery (profile, newAccessionNumber, newPatientID, newPatientName, newStudyDescription) {
    const tagObjectArray = []
    let date
    let body

    if (profile === 'Default') {
      date = TagAnon.keep
      body = TagAnon.keep

      tagObjectArray.push(new TagAnon('0010,0030', TagAnon.replace, '19000101')) // BirthDay
      tagObjectArray.push(new TagAnon('0008,1030', TagAnon.replace, newStudyDescription)) // studyDescription
      tagObjectArray.push(new TagAnon('0008,103E', TagAnon.keep)) // series Description
    } else if (profile === 'Full') {
      date = TagAnon.clear
      body = TagAnon.clear

      tagObjectArray.push(new TagAnon('0010,0030', TagAnon.replace, '19000101')) // BirthDay
      tagObjectArray.push(new TagAnon('0008,1030', TagAnon.clear)) // studyDescription
      tagObjectArray.push(new TagAnon('0008,103E', TagAnon.clear)) // series Description
    }

    // List tags releted to Date
    tagObjectArray.push(new TagAnon('0008,0022', date)) // Acquisition Date
    tagObjectArray.push(new TagAnon('0008,002A', date)) // Acquisition DateTime
    tagObjectArray.push(new TagAnon('0008,0032', date)) // Acquisition Time
    tagObjectArray.push(new TagAnon('0038,0020', date)) // Admitting Date
    tagObjectArray.push(new TagAnon('0038,0021', date)) // Admitting Time
    tagObjectArray.push(new TagAnon('0008,0035', date)) // Curve Time
    tagObjectArray.push(new TagAnon('0008,0025', date)) // Curve Date
    tagObjectArray.push(new TagAnon('0008,0023', date)) // Content Date
    tagObjectArray.push(new TagAnon('0008,0033', date)) // Content Time
    tagObjectArray.push(new TagAnon('0008,0024', date)) // Overlay Date
    tagObjectArray.push(new TagAnon('0008,0034', date)) // Overlay Time
    tagObjectArray.push(new TagAnon('0040,0244', date)) // ...Start Date
    tagObjectArray.push(new TagAnon('0040,0245', date)) // ...Start Time
    tagObjectArray.push(new TagAnon('0008,0021', date)) // Series Date
    tagObjectArray.push(new TagAnon('0008,0031', date)) // Series Time
    tagObjectArray.push(new TagAnon('0008,0020', date)) // Study Date
    tagObjectArray.push(new TagAnon('0008,0030', date)) // Study Time
    tagObjectArray.push(new TagAnon('0010,21D0', date)) // Last menstrual date
    tagObjectArray.push(new TagAnon('0008,0201', date)) // Timezone offset from UTC
    tagObjectArray.push(new TagAnon('0040,0002', date)) // Scheduled procedure step start date
    tagObjectArray.push(new TagAnon('0040,0003', date)) // Scheduled procedure step start time
    tagObjectArray.push(new TagAnon('0040,0004', date)) // Scheduled procedure step end date
    tagObjectArray.push(new TagAnon('0040,0005', date)) // Scheduled procedure step end time

    // same for Body characteristics
    tagObjectArray.push(new TagAnon('0010,2160', body)) // Patient's ethnic group
    tagObjectArray.push(new TagAnon('0010,21A0', body)) // Patient's smoking status
    tagObjectArray.push(new TagAnon('0010,0040', body)) // Patient's sex
    tagObjectArray.push(new TagAnon('0010,2203', body)) // Patient's sex neutered
    tagObjectArray.push(new TagAnon('0010,1010', body)) // Patient's age
    tagObjectArray.push(new TagAnon('0010,21C0', body)) // Patient's pregnancy status
    tagObjectArray.push(new TagAnon('0010,1020', body)) // Patient's size
    tagObjectArray.push(new TagAnon('0010,1030', body)) // Patient's weight

    // Others
    tagObjectArray.push(new TagAnon('0008,0050', TagAnon.replace, newAccessionNumber)) // Accession Number hardcoded to our system name
    tagObjectArray.push(new TagAnon('0010,0020', TagAnon.replace, newPatientID)) // new Patient Name
    tagObjectArray.push(new TagAnon('0010,0010', TagAnon.replace, newPatientName)) // new Patient Name

    // Keep some Private tags usefull for PET/CT or Scintigraphy
    tagObjectArray.push(new TagAnon('7053,1000', TagAnon.keep)) // Phillips
    tagObjectArray.push(new TagAnon('7053,1009', TagAnon.keep)) // Phillips
    tagObjectArray.push(new TagAnon('0009,103B', TagAnon.keep)) // GE
    tagObjectArray.push(new TagAnon('0009,100D', TagAnon.keep)) // GE
    tagObjectArray.push(new TagAnon('0011,1012', TagAnon.keep)) // Other

    const anonParameters = {
      KeepPrivateTags: false,
      Force: true,
      Keep: [],
      Replace: {}
    }

    tagObjectArray.forEach(tag => {
      const tagNb = tag.tagNumber
      const tagNewValue = tag.newValue
      if (tag.choice === TagAnon.keep) {
        anonParameters.Keep.push(tagNb)
      } else if (tag.choice === TagAnon.replace) {
        anonParameters.Replace[tagNb] = tagNewValue
      }
    })

    console.log(JSON.stringify(anonParameters))

    return JSON.stringify(anonParameters)
  }

  makeAnon (level, orthancID, profile, newAccessionNumber, newPatientID, newPatientName, newStudyDescription) {
    const self = this

    const requestPromise = request.post(self._createOptions('POST', '/' + level + '/' + orthancID + '/anonymize', self.buildAnonQuery(profile, newAccessionNumber, newPatientID, newPatientName, newStudyDescription))).then(function (body) {
      console.log(body)
    }).catch((error) => { console.log('Error make anon ' + error) })

    return requestPromise
  }
}

module.exports = Orthanc
