const Queue = require('bull')
const fs = require('fs')
const time = require('../utils/time')
const Orthanc = require('./Orthanc')
const OrthancQueryAnswer = require('./queries-answer/OrthancQueryAnswer')
const ReverseProxy = require('./ReverseProxy')
const schedule = require('node-schedule')
const Options = require('./Options')

const JOBS_PROGRESS_INTERVAL = 250
const REDIS_OPTIONS = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
}


let orthanc = new Orthanc()

let instance
class OrthancQueue {
  constructor() {
    if (instance) return instance

    instance = this

    this._jobs = {}

    this.exportQueue = new Queue('orthanc-export', {redis:REDIS_OPTIONS})
    this.deleteQueue = new Queue('orthanc-delete', {redis:REDIS_OPTIONS})
    this.anonQueue = new Queue('orthanc-anon', {redis:REDIS_OPTIONS})
    this.aetQueue = new Queue('orthanc-aet', {redis:REDIS_OPTIONS})
    this.validationQueue = new Queue('orthanc-validation', {redis:REDIS_OPTIONS})

    //Hack to fix a quirk in bull
    this.exportQueue.on('progress', async (job, data) => {
      this._jobs[job.id]._progress = await job.progress()
    })
    this.anonQueue.on('progress', async (job, data) => {
      this._jobs[job.id]._progress = await job.progress()
    })
    this.aetQueue.on('progress', async (job, data) => {
      this._jobs[job.id]._progress = await job.progress()
    })
    this.validationQueue.on('progress', async (job, data) => {
      this._jobs[job.id]._progress = await job.progress()
    })

    this.exportQueue.process('create-archive', OrthancQueue._getArchiveDicom)
    this.deleteQueue.process('delete-item', OrthancQueue._deleteItem)
    this.anonQueue.process('anonymize-item', OrthancQueue._anonymizeItem)
    this.validationQueue.process('validate-item', OrthancQueue._validateItem)
    this.aetQueue.process('retrieve-item', OrthancQueue._retrieveItem)

    this.pauser = null
    this.resumer = null

    Options.optionEventEmiter.on('schedule_change', ()=>{
      this.setupRetrieveSchedule()
    })
    this.setupRetrieveSchedule()
  }

  async setupRetrieveSchedule(){
    const optionsParameters = await Options.getOptions()
    let now = new Date(Date.now());
    
    if(this.pauser) this.pauser.cancel()
    if(this.resumer) this.resumer.cancel()

    if(time.isTimeInbetween(now.getHours(),now.getMinutes(),optionsParameters.hour,optionsParameters.minute,optionsParameters.hour+4,optionsParameters.minute)){
      this.aetQueue.resume()
    }else{
      this.aetQueue.pause()
    }
    this.resumer = schedule.scheduleJob(optionsParameters.min_start + ' ' + optionsParameters.hour_start + ' * * *', ()=>{
      this.aetQueue.resume()
    })
    this.pauser = schedule.scheduleJob(optionsParameters.min_stop + ' ' + optionsParameters.hour_stop + ' * * *', ()=>{
      this.aetQueue.pause()
    })
  }

  

  static async _getArchiveDicom(job, done) {
    let orthancIds = job.data.orthancIds
    let transcoding = job.data.transcoding

    let payload

    if (transcoding) {
      payload = {
        "Synchronous": false,
        "Transcode": transcoding,
        "Resources": orthancIds
      }
    } else {
      payload = {
        "Synchronous": false,
        "Resources": orthancIds
      }
    }

    let r = await ReverseProxy.getAnswer('/tools/create-archive', 'POST', payload)
    let jobPath = r.Path

    await orthanc.monitorJob(jobPath, (response) => { job.progress(response.Progress) }, JOBS_PROGRESS_INTERVAL).then((response) => {
      const destination = './data/export_dicom/' + Math.random().toString(36).substr(2, 5) + '.zip'
      const streamWriter = fs.createWriteStream(destination)
      ReverseProxy.streamToFileWithCallBack(jobPath + '/archive', 'GET', {}, streamWriter, () => {
        done(null, { path: destination })
      })
    }).catch((error) => {
      done(error)
    })
  }

  static async _anonymizeItem(job, done) {
    let item = job.data.item

    let anonAnswer = await orthanc.makeAnon('studies', item.sourceOrthancStudyID, item.anonProfile, item.newAccessionNumber, item.newPatientID, item.newPatientName, item.newStudyDescription, false)

    orthanc.monitorJob(anonAnswer.Path, (response) => { job.progress(response.Progress) }, JOBS_PROGRESS_INTERVAL).then(async (answer) => {
      if (answer.Content.PatientID !== undefined) {
        //If default, remove the secondary capture SOPClassUID
        if (item.anonProfile === 'Default') {
          let anonymizedStudyDetails = await orthanc.getOrthancDetails('studies', answer.Content.ID)
          for (let seriesOrthancID of anonymizedStudyDetails['Series']) {
            let seriesDetails = await orthanc.getOrthancDetails('series', seriesOrthancID)
            let firstInstanceID = seriesDetails['Instances'][0]
            let sopClassUID = await orthanc.getSopClassUID(firstInstanceID)
            if (OrthancQueue.isSecondaryCapture(sopClassUID)) {
              await orthanc.deleteFromOrthanc('series', seriesOrthancID)
            }
          }
        }

        job.progress(100)
        done(null, answer.ID)
      } else {
        done("Orthanc Error Anonymizing")
      }
    })
  }

  static async _deleteItem(job, done) {
    await orthanc.deleteFromOrthanc('series', job.data.orthancId)
    done()
  }

  static async _validateItem(job, done) {
    OrthancQueue.buildDicomQuery(job.data.item)

    const answerDetails = await orthanc.makeDicomQuery(job.data.item.OriginAET)
    
    if (answerDetails.length === 1) {
      job.progress(100)
      done(null, true)
    }else{
      job.progress(100)
      done(null, false)
    }
    
  }

  static async _retrieveItem(job, done) {
    OrthancQueue.buildDicomQuery(job.data.item)
    
    const answerDetails = await orthanc.makeDicomQuery(job.data.item.OriginAET)
    const answer = answerDetails[0]
    const retrieveAnswer = await orthanc.makeRetrieve(answer.AnswerId, answer.AnswerNumber, await orthanc.getOrthancAetName(), false)
    
    
    await orthanc.monitorJob(retrieveAnswer.Path,(response)=>{
      job.progress(response.Progress)
    }, 2000).then(async(response)=>{
      const orthancResults = await orthanc.findInOrthancByUid(response.Content['Query'][0]['0020,000d'])
      done(null, orthancResults[0].ID)
    }).catch((error)=>{
      console.error(error)
      done(error)
    })
  }



  queueGetArchive(orthancIds, transcoding) {
    return this.exportQueue.add('create-archive', { orthancIds, transcoding }).then((job) => {
      this._jobs[job.id] = job
      return job
    })
  }

  queueAnonymizeItem(item) {
    return this.anonQueue.add('anonymize-item', { item }).then((job) => {
      this._jobs[job.id] = job
      return job
    })
  }

  queueDeleteItem(orthancId) {
    return this.deleteQueue.add('delete-item', { orthancId })
  }

  queueValidateRetrieve(item) {
    return this.validationQueue.add('validate-item', { item }).then((job) => {
      this._jobs[job.id] = job
      return job
    }) 
  }

  queueRetrieveItem(item) {
    return this.aetQueue.add('retrieve-item', { item }).then((job) => {
      this._jobs[job.id] = job
      return job
    }) 
  }

  queueDeleteItems(orthancIds) {
    return this.deleteQueue.addBulk(orthancIds.map(orthancId => {
      return {
        name: 'delete-item',
        data: {
          orthancId
        }
      }
    }))
  }

  /**
   * Prepare Orthanc Object Query according to Item QueryLevel
   * @param {JobItemRetrieve} item 
   */
  static buildDicomQuery(item) {
    if (item.Level === OrthancQueryAnswer.LEVEL_STUDY) {
      orthanc.buildStudyDicomQuery('', '', '', '', '', '', item.StudyInstanceUID)
    } else if (item.Level === OrthancQueryAnswer.LEVEL_SERIES) {
      orthanc.buildSeriesDicomQuery(item.studyInstanceUID, '', '', '', '', item.SeriesInstanceUID)
    }
  }

  static isSecondaryCapture(sopClassUid) {

    let secondaryCapturySopClass = [
      "1.2.840.10008.5.1.4.1.1.7",
      "1.2.840.10008.5.1.4.1.1.7.1",
      "1.2.840.10008.5.1.4.1.1.7.2",
      "1.2.840.10008.5.1.4.1.1.7.3",
      "1.2.840.10008.5.1.4.1.1.7.4",
      "1.2.840.10008.5.1.4.1.1.88.11",
      "1.2.840.10008.5.1.4.1.1.88.22",
      "1.2.840.10008.5.1.4.1.1.88.33",
      "1.2.840.10008.5.1.4.1.1.88.40",
      "1.2.840.10008.5.1.4.1.1.88.50",
      "1.2.840.10008.5.1.4.1.1.88.59",
      "1.2.840.10008.5.1.4.1.1.88.65",
      "1.2.840.10008.5.1.4.1.1.88.67"
    ]

    return secondaryCapturySopClass.includes(sopClassUid)

  }
}

module.exports = OrthancQueue