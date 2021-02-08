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
    if(time.isTimeInbetween(now.getHours(),now.getMinutes(),optionsParameters.hour_start,optionsParameters.min_start,optionsParameters.min_stop,optionsParameters.hour_stop)){
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
   * Create the job for the export task
   * @param {string} creator username of the creator of the jobs
   * @param {[string]} orthancIds ids to be exported
   * @param {string} transcoding transcoding used to create the archive
   * @param {Endpoint} endpoint target endpoint
   * @returns {string} the task uuid
   */
  exportToEndpoint(creator, orthancIds, transcoding, endpoint) {
    let taskId = 'e-'+uuid();
    this.exportQueue.add('create-archive', {creator, taskId, orthancIds, transcoding, endpoint});
    return taskId;
  }

  /**
   * Create the jobs for the anonimisation task
   * @param {string} creator username of the creator of the jobs
   * @param {[any]} items items to be anonymised
   * @returns {string} the task uuid
   */
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

  /**
   * Create the jobs for the deletion task
   * @param {string} creator username of the creator of the jobs
   * @param {[any]} items items to be deleted
   * @returns {string} the task uuid
   */
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
  
  /**
   * Create the jobs for the retrieve task
   * @param {string} creator username of the creator of the jobs
   * @param {string} projectName name of the retrieve project
   * @param {[any]} items items to be retrieved
   * @returns {string} the task uuid
   */
  validateItems(creator, projectName, items){
    let taskId = 'r-'+uuid();

    // Checking for duplicate
    let curratedItems = items.reduce((agregation, item)=>{
      console.log(agregation);
      if (item.Level === OrthancQueryAnswer.LEVEL_STUDY) {
        for (const existingItem of agregation) {
          if (item.studyInstanceUID===existingItem.studyInstanceUID) return agregation;
        }
        agregation.push(item);
      } else if (item.Level === OrthancQueryAnswer.LEVEL_SERIES) {
        for (const existingItem of agregation) {
          if (item.studyInstanceUID===existingItem.studyInstanceUID && item.SeriesInstanceUID===existingItem.SeriesInstanceUID) return agregation;
        }
        agregation.push(item);
      }
      return agregation;
    }, []);

    let jobs = curratedItems.map(item=>{
      return {
        name : "validate-item",
        data : {
          taskId,
          creator,
          projectName,
          item
        }
      }
    });
    this.validationQueue.addBulk(jobs);
    return taskId;
  }

  /**
   * allow the retrieve task to procede to retrieval
   * @param {string} taskId uuid of the task to approved
   */
  async approveTask(taskId){
    let jobs = await this.getValidationJobs(taskId);

    let datas = [];
    for (const job of jobs) {
      datas.push(
        {
          name:'retrieve-item',
          data:job.data
        });
      if(!await job.finished()) return;
    }
    this.aetQueue.addBulk(datas);
  }


  /**
   * get the jobs part of the task of the givent id
   * @param {string} taskId uuid of the task
   * @returns {[Job]} return bull jobs
   */
  async getArchiveCreationJobs(taskId){
    let jobs = await this.exportQueue.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.taskId === taskId);
  }

  /**
   * get the jobs part of the task of the givent id
   * @param {string} taskId uuid of the task
   * @returns {[Job]} return bull jobs
   */
  async getAnonimizationJobs(taskId){
    let jobs = await this.anonQueue.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.taskId === taskId);
  }

  /**
   * get the jobs part of the task of the givent id
   * @param {string} taskId uuid of the task
   * @returns {[Job]} return bull jobs
   */
  async getDeleteJobs(taskId){
    let jobs = await this.deleteQueue.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.taskId === taskId);
  }

  /**
   * get the jobs part of the task of the givent id
   * @param {string} taskId uuid of the task
   * @returns {[Job]} return bull jobs
   */
  async getValidationJobs(taskId){
    let jobs = await this.validationQueue.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.taskId === taskId);
  }

  /**
   * get the jobs part of the task of the givent id
   * @param {string} taskId uuid of the task
   * @returns {[Job]} return bull jobs
   */
  async getRetrieveItem(taskId){
    let jobs = await this.aetQueue.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.taskId === taskId);
  }

  /**
   * get the jobs part of the tasks of a given user
   * @param {string} user username of the task creator
   * @returns {[Job]} return bull jobs
   */
  async getUserArchiveCreationJobs(user){
    let jobs = await this.exportQueue.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.creator === user);
  }

  /**
   * get the jobs part of the tasks of a given user
   * @param {string} user username of the task creator
   * @returns {[Job]} return bull jobs
   */
  async getUserAnonimizationJobs(user){
    let jobs = await this.anonQueue.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.creator === user);
  }

  /**
   * get the jobs part of the tasks of a given user
   * @param {string} user username of the task creator
   * @returns {[Job]} return bull jobs
   */
  async getUserDeleteJobs(user){
    let jobs = await this.deleteQueue.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.creator === user);
  }

  /**
   * get the jobs part of the tasks of a given user
   * @param {string} user username of the task creator
   * @returns {[Job]} return bull jobs
   */
  async getUserValidationJobs(user){
    let jobs = await this.validationQueue.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.creator === user);
  }

  /**
   * get the jobs part of the tasks of a given user
   * @param {string} user username of the task creator
   * @returns {[Job]} return bull jobs
   */
  async getUserRetrieveItem(user){
    let jobs = await this.aetQueue.getJobs(["completed","active","waiting","delayed","paused"]);
    return jobs.filter(job=>job.data.creator === user);
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