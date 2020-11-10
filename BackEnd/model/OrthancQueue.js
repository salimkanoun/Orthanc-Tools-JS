const Queue = require('bull')
const fs = require('fs')
const Orthanc = require('./Orthanc')
const ReverseProxy = require('./ReverseProxy')
const Job = require('./robot/Job')

const JOBS_PROGRESS_INTERVAL = 250

let orthanc = new Orthanc()

let instance
class OrthancQueue {
  constructor() {
    if (instance) return instance

    instance = this

    this._jobs = {}

    this.exportQueue = new Queue('orthanc-export')
    this.deleteQueue = new Queue('orthanc-delete')
    this.anonQueue = new Queue('orthanc-anon')
    
    //Hack to fix a quirk in bull
    this.exportQueue.on('progress', async (job,data)=>{
      this._jobs[job.id]._progress = await job.progress()
    })
    
    this.exportQueue.process('create-archive',OrthancQueue._getArchiveDicom)
    this.deleteQueue.process('delete-item', OrthancQueue._deleteItem)
    this.anonQueue.process('anonymize-item',OrthancQueue._anonimiseItem)
  }
  
  static async _getArchiveDicom(job, done) {
    let orthancIds = job.data.orthancIds
    let transcoding = job.data.transcoding

    let payload

    if (transcoding) {
      payload = {
        "Synchronous":false,
        "Transcode": transcoding,
        "Resources": orthancIds
      }
    } else {
      payload = {
        "Synchronous":false,
        "Resources": orthancIds
      }
    }

    let r = await ReverseProxy.getAnswer('/tools/create-archive', 'POST', payload)
    let jobPath = r.Path

    await orthanc.monitorJob(jobPath, (response)=>{job.progress(response.Progress)}, JOBS_PROGRESS_INTERVAL).then((response)=>{
      const destination = './data/export_dicom/' + Math.random().toString(36).substr(2, 5) + '.zip'
      const streamWriter = fs.createWriteStream(destination)
      ReverseProxy.streamToFileWithCallBack(jobPath+'/archive', 'GET', {}, streamWriter, () => {
        done(null, {path:destination})
      })
    }).catch((error)=>{
      done(error)
    })
  }

  static async _anonimiseItem(job, done) {
    let item = job.data.item
    
    let anonAnswer = await orthanc.makeAnon('studies', item.sourceOrthancStudyID, item.anonProfile, item.newAccessionNumber, item.newPatientID, item.newPatientName, item.newStudyDescription, false)

    orthanc.monitorJob(anonAnswer.Path, (response)=>{job.progress(response.Progress)}, JOBS_PROGRESS_INTERVAL).then(async(answer)=>{
      if (answer.Content.PatientID !== undefined) {
        //If default, remove the secondary capture SOPClassUID
        if(item.anonProfile === 'Default'){
          let anonymizedStudyDetails  = await orthanc.getOrthancDetails('studies', answer.Content.PatientID)
          for(let seriesOrthancID of anonymizedStudyDetails['Series']){
            let seriesDetails = await orthanc.getOrthancDetails('series', seriesOrthancID)
            let firstInstanceID = seriesDetails['Instances'][0]
            let sopClassUID = await orthanc.getSopClassUID(firstInstanceID)
            if(this.isSecondaryCapture(sopClassUID)){
              await orthanc.deleteFromOrthanc('series', seriesOrthancID)
            }
          }
        }
  
        job.progress(100)
        done(null, jobAnswer.ID)
      } else {
        done("Orthanc Error Anonymizing")
      }
    })
  }

  static async _deleteItem(job, done) {
    await orthanc.deleteFromOrthanc('series', job.data.orthancId)
    done()
  }

  queueGetArchive(orthancIds,transcoding){
    return this.exportQueue.add('create-archive', {orthancIds, transcoding}).then((job)=>{
      this._jobs[job.id] = job
      return job
    })
  }

  queueAnonymizeItem(item){
    return this.anonQueue.add('anonymize-item', {item}).then((job)=>{
      this._jobs[job.id] = job
      return job
    })
  }

  queueDeleteItem(orthancId){
    return this.deleteQueue.add('delete-item', {orthancId})
  }

  queueDeleteItems(orthancIds){
    return this.deleteQueue.addBulk(orthancIds.map(orthancId=>{return{
      name:'delete-item',
      data:{
        orthancId
      }
    }}))
  }

  static isSecondaryCapture(sopClassUid){

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