const Queue = require('bull')
const fs = require('fs')
const time = require('../utils/time')
const Orthanc = require('./Orthanc')
const OrthancQueryAnswer = require('./queries-answer/OrthancQueryAnswer')
const ReverseProxy = require('./ReverseProxy')
const schedule = require('node-schedule')
const Options = require('./Options')
const Exporter = require('./export/Exporter')
const Endpoint = require('./export/Endpoint');
const {v4:uuid} = require('uuid');

const JOBS_PROGRESS_INTERVAL = 250
const REDIS_OPTIONS = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
}

let exporter = new Exporter();


let orthanc = new Orthanc()

let instance
class OrthancQueue {
  constructor() {
    if (instance) return instance

    instance = this

    this._jobs = {}

    //Creating Queues
    this.exportQueue = new Queue('orthanc-export', {redis:REDIS_OPTIONS})
    this.deleteQueue = new Queue('orthanc-delete', {redis:REDIS_OPTIONS})
    this.anonQueue = new Queue('orthanc-anon', {redis:REDIS_OPTIONS})
    this.aetQueue = new Queue('orthanc-aet', {redis:REDIS_OPTIONS})
    this.validationQueue = new Queue('orthanc-validation', {redis:REDIS_OPTIONS})

    //adding processor to queues
    this.exportQueue.process('create-archive', OrthancQueue._getArchiveDicom)
    this.deleteQueue.process('delete-item', OrthancQueue._deleteItem)
    this.anonQueue.process('anonymize-item', OrthancQueue._anonymizeItem)
    this.validationQueue.process('validate-item', OrthancQueue._validateItem)
    this.aetQueue.process('retrieve-item', OrthancQueue._retrieveItem)

    this.exportQueue.on("completed",async(job, result)=>{
      let endpoint = await Endpoint.getFromId(job.data.endpoint);
      exporter.uploadFile(job.data.taskId, endpoint, result.path);
    })

    this.pauser = null
    this.resumer = null

    //Subscribing to option to listen for change in scheduling
    Options.optionEventEmiter.on('schedule_change', ()=>{
      this.setupRetrieveSchedule()
    })

    this.setupRetrieveSchedule()
  }

  /**
   * Setup the scheduling for the queue
   */
  async setupRetrieveSchedule(){
    const optionsParameters = await Options.getOptions()
    let now = new Date(Date.now());
    
    //Remove previous set schedule 
    if(this.pauser) this.pauser.cancel()
    if(this.resumer) this.resumer.cancel()
    
    //Pausing or unpausing the aet queue 
    if(time.isTimeInbetween(now.getHours(),now.getMinutes(),optionsParameters.hour,optionsParameters.minute,optionsParameters.hour+4,optionsParameters.minute)){
      this.aetQueue.resume()
    }else{
      this.aetQueue.pause()
    }

    //Schedule for the queue to be paused and unpaused
    this.resumer = schedule.scheduleJob(optionsParameters.min_start + ' ' + optionsParameters.hour_start + ' * * *', ()=>{
      this.aetQueue.resume()
    })
    this.pauser = schedule.scheduleJob(optionsParameters.min_stop + ' ' + optionsParameters.hour_stop + ' * * *', ()=>{
      this.aetQueue.pause()
    })
  }

  /**
   * Processor that generate an archive basedon orthanc id 
   * @param {object} job
   * @param {object} done 
   */
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

    //Request the creation of an archive 
    let r = await ReverseProxy.getAnswer('/tools/create-archive', 'POST', payload)
    let jobPath = r.Path

    //Monitor the orthanc job
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

  /**
   * Processor that anonymize the study of a given id 
   * @param {object} job
   * @param {object} done 
   */
  static async _anonymizeItem(job, done) {
    let item = job.data.item

    //Requesting orthanc API to anonymize a study  
    let anonAnswer = await orthanc.makeAnon('studies', item.orthancStudyID, item.anonProfile, item.newAccessionNumber, item.newPatientID, item.newPatientName, item.newStudyDescription, false)

    //Monitor orthanc job 
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
        done(null, answer.Content.ID)
      } else {
        done("Orthanc Error Anonymizing")
      }
    })
  }

  /**
   * Processor that delete the series of a given id
   * @param {object} job
   * @param {object} done 
   */
  static async _deleteItem(job, done) {

    await orthanc.deleteFromOrthanc('series', job.data.orthancId)
    done()
  }

  /**
   * Processor that check the study of a given query 
   * @param {object} job
   * @param {object} done 
   */
  static async _validateItem(job, done) {
    OrthancQueue.buildDicomQuery(job.data.item)

    //Querry the dicom 
    const answerDetails = await orthanc.makeDicomQuery(job.data.item.OriginAET)
    
    // checking the answer compte
    if (answerDetails.length === 1) {
      job.progress(100)
      done(null, true)
    }else{
      job.progress(100)
      done(null, false)
    }
    
  }

  /**
   * Processor that retrieve the study of a given query 
   * @param {object} job
   * @param {object} done 
   */
  static async _retrieveItem(job, done) {
    OrthancQueue.buildDicomQuery(job.data.item)
    
    //Retrieve the item
    const answerDetails = await orthanc.makeDicomQuery(job.data.item.OriginAET)
    const answer = answerDetails[0]
    const retrieveAnswer = await orthanc.makeRetrieve(answer.AnswerId, answer.AnswerNumber, await orthanc.getOrthancAetName(), false)
    
    //Monitor the orthanc job
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


  /**
   * Add an item to the anonymisation queue
   * @param {string} orthancIds item uuid to be queued
   */
  queueGetArchive(orthancIds, transcoding) {
    return this.exportQueue.add('create-archive', { orthancIds, transcoding }).then((job) => {
      this._jobs[job.id] = job
      return job
    })
  }

  exportToEndpoint(creator, orthancIds, transcoding, endpoint) {
    let taskId = 'e-'+uuid();
    this.exportQueue.add('create-archive', {creator, taskId, orthancIds, transcoding, endpoint});
    return taskId;
  }

  anonimizeItems(creator, items){
    let taskId = 'a-'+uuid();
    let jobs = items.map(item=>{
      return {
        name : "anonymize-item",
        data : {
          taskId,
          creator,
          item
        }
      }
    });
    this.anonQueue.addBulk(jobs);
    return taskId;
  }

  deleteItems(creator, items){
    let taskId = 'd-'+uuid();
    let jobs = items.map(item=>{
      return {
        name : "delete-item",
        data : {
          taskId,
          creator,
          orthancId : item
        }
      }
    });
    this.deleteQueue.addBulk(jobs);
    return taskId;
    
  }


  async getArchiveCreationJobs(taskId){
    let jobs = await this.exportQueue.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.taskId === taskId);
  }

  async getAnonimizationJobs(taskId){
    let jobs = await this.anonQueue.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.taskId === taskId);
  }

  async getDeleteJobs(taskId){
    let jobs = await this.deleteItems.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.taskId === taskId);
  }

  /**
   * Add an item to the anonymisation queue
   * @param {string} orthancIds item uuid to be queued
   */
  queueAnonymizeItem(item) {
    return this.anonQueue.add('anonymize-item', { item }).then((job) => {
      this._jobs[job.id] = job
      return job
    })
  }

  /**
   * Add an item to the deletion queue
   * @param {string} orthancIds item uuid to be queued
   */
  queueDeleteItem(orthancId) {
    return this.deleteQueue.add('delete-item', { orthancId })
  }

  /**
   * Add an item to the validation queue
   * @param {string} orthancIds item uuid to be queued
   */
  queueValidateRetrieve(item) {
    return this.validationQueue.add('validate-item', { item }).then((job) => {
      this._jobs[job.id] = job
      return job
    }) 
  }

  /**
   * Add an item to the retrieve queue
   * @param {string} orthancIds item uuid to be queued
   */
  queueRetrieveItem(item) {
    return this.aetQueue.add('retrieve-item', { item }).then((job) => {
      this._jobs[job.id] = job
      return job
    }) 
  }

  /**
   * Add an items to the deletion queue
   * @param {string[]} orthancIds items uuids to be queued
   */
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