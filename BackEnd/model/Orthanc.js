const fs = require('fs')
const QueryStudyAnswer = require('./queries-answer/QueryStudyAnswer')
const QuerySerieAnswer = require('./queries-answer/QuerySeriesAnswer')
const TagAnon = require('./TagAnon')
const ReverseProxy = require('./ReverseProxy')

/**
 * Orthanc object to communications with orthanc server
 */
class Orthanc {

  /**
   * Return AET Name of the Orthanc Server
   */
  async getOrthancAetName () {
    const systemAnswer = await ReverseProxy.getAnswer('/system', 'GET', undefined)
    return systemAnswer.DicomAet
  }

   /**
    * Export an orthanc ressource to Export folder in hierachical ZIP
    * @param {Array} orthancIds 
    * @param {string} filename without extension
    */
  exportArchiveDicom (orthancIds, filename) {
    const destination = './data/export_dicom/' + filename + '.zip'
    const streamWriter = fs.createWriteStream(destination)
    ReverseProxy.streamToFile('/tools/create-archive', 'POST', orthancIds, streamWriter)
  }

  getArchiveDicom(orthancIds, transcoding = null)  {

    let payload
    
    if(transcoding){
      payload ={
        "Transcode": transcoding,
        "Resources": orthancIds
      }
    }else{
      payload ={
        "Resources": orthancIds
      }
    }

     return new Promise( (resolve, reject)=>{

       try{

        const destination = './data/export_dicom/' + Math.random().toString(36).substr(2, 5) + '.zip'
        const streamWriter = fs.createWriteStream(destination)
        ReverseProxy.streamToFileWithCallBack('/tools/create-archive', 'POST', payload, streamWriter, ()=>{
          resolve(destination)
        })

       } catch (err) {
         reject()
       }


    })
    
  } 

  getArchiveDicomDir(orthancIds, transcoding = 'None')  {

    let payload

    if(transcoding !== 'None'){
      payload ={
        "Transcode": transcoding,
        "Resources": orthancIds
      }
    }else{
      payload ={
        "Resources": orthancIds
      }
    }

    return new Promise( (resolve, reject)=>{
      try{
       const destination = './data/export_dicom/' + Math.random().toString(36).substr(2, 5) + '.zip'
       const streamWriter = fs.createWriteStream(destination)
       ReverseProxy.streamToFileWithCallBack('/tools/create-media-extended', 'POST', payload, streamWriter, ()=>{
         resolve(destination)
       })

      } catch (err) {
        reject(err)
      }

   })
   
 } 

  getArchiveDicomPath(filename){
    return './data/export_dicom/' + filename + '.zip'
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
  buildStudyDicomQuery (patientName = '', patientID = '', studyDate = '', modality = '', studyDescription = '', accessionNb = '', studyInstanceUID = '') {
    if (patientName === '*^*') patientName = ''
    // Remove * character as until date X should be written -dateX and not *-dateX
    studyDate = studyDate.replace(/[*]/g, '')

    if (studyDate === '-') studyDate = ''

    this.preparedQuery = {
      Level: 'Study',
      Query: {
        PatientName: patientName,
        PatientID: patientID,
        StudyDate: studyDate,
        ModalitiesInStudy: modality,
        StudyDescription: studyDescription,
        AccessionNumber: accessionNb,
        StudyInstanceUID: studyInstanceUID,
        NumberOfStudyRelatedInstances: '',
        NumberOfStudyRelatedSeries: '',
        RequestedProcedureDescription: ''
      }
    }
  }

  buildSeriesDicomQuery (studyUID = '', modality = '', protocolName = '', seriesDescription = '', seriesNumber = '', seriesInstanceUID = '') {
    this.preparedQuery = {
      Level: 'Series',
      Query: {
        Modality: modality,
        ProtocolName: protocolName,
        SeriesDescription: seriesDescription,
        SeriesInstanceUID: seriesInstanceUID,
        StudyInstanceUID: studyUID,
        SeriesNumber: seriesNumber,
        NumberOfSeriesRelatedInstances: ''
      }
    }
  }

  /**
     * Make Query on AET an return response a parsed answer
     * @param {String} aet
     */
  async makeDicomQuery (aet) {
    console.log(this.preparedQuery)
    const answer = await ReverseProxy.getAnswer('/modalities/' + aet + '/query', 'POST', this.preparedQuery)

    if (this.preparedQuery.Level === 'Study') {
      return this.getStudyAnswerDetails(answer.ID, aet)
    } else {
      return this.getSeriesAnswerDetails(answer.ID, aet)
    }
  }

  async _getAnswerLevel (answerId) {
    return await ReverseProxy.getAnswerPlainText('/queries/' + answerId + '/level', 'GET', undefined)
  }

  async _getAnswerOriginAET (answerId) {
    return await ReverseProxy.getAnswerPlainText('/queries/' + answerId + '/modality', 'GET', undefined)
  }

  async _getAnswerDetails (answerId) {
    return await ReverseProxy.getAnswer('/queries/' + answerId + '/answers?expand', 'GET', undefined)
  }

  async getSeriesAnswerDetails (answerId, aet) {
    const answerQuery = await this._getAnswerDetails(answerId)

    const answersObjects = []

    for (let i = 0; i < answerQuery.length; i++) {
      const element = answerQuery[i]

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
      const queryAnswserObject = new QuerySerieAnswer(answerId, i, StudyInstanceUID, SeriesInstanceUID, Modality, SeriesDescription, SeriesNumber, originAET, numberOfSeriesRelatedInstances)
      answersObjects.push(queryAnswserObject)
    }

    return answersObjects
  }

  async getStudyAnswerDetails (answerId, aet) {
    const studyAnswers = await this._getAnswerDetails(answerId)
    
    const answersObjects = []

    for (let i = 0; i < studyAnswers.length; i++) {
      const element = studyAnswers[i]
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

      let requestedProcedureDescription = 'N/A'
      if (element.hasOwnProperty('0032,1060')) {
        requestedProcedureDescription = element['0032,1060'].Value
      }

      
      const origineAET = aet
      const queryAnswserObject = new QueryStudyAnswer(answerId, i, origineAET, patientName, patientID, accessionNb, modalitiesInStudy, studyDescription, studyUID, studyDate, numberOfStudyRelatedSeries, numberOfStudyRelatedInstances, requestedProcedureDescription)
      answersObjects.push(queryAnswserObject)
    }

    return answersObjects
  }

  async makeRetrieve (queryID, answerNumber, aet, synchronous = false) {
    const postData = {
      Synchronous: synchronous,
      TargetAet: aet
    }

    const answer = await ReverseProxy.getAnswer('/queries/' + queryID + '/answers/' + answerNumber + '/retrieve', 'POST', postData)

    return answer
  }

  async findInOrthanc (level = 'Study', patientName = '', patientID = '', accessionNb = '', date = '', studyDescription = '', modality = '', studyInstanceUID = '') {

    const queryParameter = {
      Level: level,
      CaseSensitive: false,
      Expand: true,
      Query: {
        StudyDate : date,
        StudyDescription : studyDescription,
        ModalitiesInStudy : modality,
        PatientName : patientName,
        PatientID : patientID,
        AccessionNumber : accessionNb,
        StudyInstanceUID : studyInstanceUID
  
      }
    }

    console.log(queryParameter)

    const answer = await ReverseProxy.getAnswer('/tools/find', 'POST', queryParameter)

    return answer
  }

  /**
     * Find Orthanc study ID by dicom StudyInstanceUID
     * @param {string} studyUID
     */
  async findInOrthancByUid (studyUID) {

    console.log(studyUID)
    const answer = await this.findInOrthanc('Study', '', '', '', '', '', '', studyUID)
    return answer
  }

  /**
     * Return details of the patients, studies, series GET API
     * @param {string} level
     * @param {string} orthancID
     */
  async getOrthancDetails (level, orthancID) {
    const answer = await ReverseProxy.getAnswer('/' + level + '/' + orthancID, 'GET', undefined)
    return answer
  }

  async getStudiesDetailsOfPatient(orthancID){
    const answer = await ReverseProxy.getAnswer('/patients/' + orthancID + '/studies?expand', 'GET', undefined)
    return answer
  }

  async getSeriesDetailsOfStudy(orthancID){
    const answer = await ReverseProxy.getAnswer('/studies/' + orthancID + '/series?expand', 'GET', undefined)
    return answer
  }

  /**
     * Delete a ressource in Orthanc
     * @param {string} level
     * @param {string} orthancID
     */
  async deleteFromOrthanc (level, orthancID) {
    const answer = await ReverseProxy.getAnswer('/' + level + '/' + orthancID, 'DELETE', undefined)
    return answer
  }

  /**
     * Prepare Anon Query in Orthanc
     * @param {string} profile
     * @param {string} newAccessionNumber
     * @param {string} newPatientID
     * @param {string} newPatientName
     * @param {string} newStudyDescription
     */
  buildAnonQuery (profile, newAccessionNumber, newPatientID, newPatientName, newStudyDescription, synchronous) {
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
    tagObjectArray.push(new TagAnon('0008,0050', TagAnon.replace, newAccessionNumber)) // Accession Number
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
      Synchronous : synchronous,
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

    return anonParameters
  }

  async makeAnon (level, orthancID, profile, newAccessionNumber, newPatientID, newPatientName, newStudyDescription, synchronous) {
    let postData = this.buildAnonQuery(profile, newAccessionNumber, newPatientID, newPatientName, newStudyDescription, synchronous);
    const answer = await ReverseProxy.getAnswer('/' + level + '/' + orthancID + '/anonymize', 'POST', postData )
    return answer
  }

   async getChanges (last) {
    //let outPutStream = this.getOrthancAetName() + "/changes?since=" + last
    let outPutStream = "/changes?since=" + last
    let changes = await ReverseProxy.getAnswer(outPutStream, "GET", undefined)
    return changes
  }

  async getChangesLast() {
    //let outPutStream = this.getOrthancAetName() + "/changes?last"
    let outPutStream = "/changes?last"
    let changes = await ReverseProxy.getAnswer(outPutStream, "GET", undefined)
    return changes
  }

  async getSopClassUID(instanceID){
    let changes = await ReverseProxy.getAnswerPlainText('/instances/'+instanceID+"/metadata/SopClassUid", "GET", undefined)
    return changes
  }

  monitorJob(jobPath, updateCallback, updateInterval){
    return new Promise((resolve, reject)=>{
      let interval = setInterval(()=>{
        ReverseProxy.getAnswer(jobPath, 'GET', null).then((response)=>{
          updateCallback(response)
          if(response.State==="Success"){
            clearInterval(interval)
            resolve(response)
          }else if(response.State==="Failed"){
            clearInterval(interval)
            reject(response)
          }
        })
      },updateInterval)
    })
  }
}

module.exports = Orthanc
