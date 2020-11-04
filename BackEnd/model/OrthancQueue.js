const Queue = require('bull')
const fs = require('fs')
const ReverseProxy = require('./ReverseProxy')

const JOBS_INTERVAL = 500

let instance
class OrthancQueue {
  constructor() {
    if (instance) return instance

    instance = this

    this._jobs = {}

    this.queue = new Queue('orthanc')
    this.queue.on('progress', async (job,data)=>{
      this._jobs[job.id]._progress = await job.progress()
    })
    this.queue.process('create-archive',OrthancQueue._getArchiveDicom)
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

    await new Promise((resolve, reject)=>{
      let interval = setInterval(()=>{
        ReverseProxy.getAnswer(jobPath, 'GET', null).then((response)=>{
          job.progress(response.Progress)
          if(response.Progress>=100){
            clearInterval(interval)
            resolve()
          }
        })
      },JOBS_INTERVAL)
    }).then(()=>{
      const destination = './data/export_dicom/' + Math.random().toString(36).substr(2, 5) + '.zip'
      const streamWriter = fs.createWriteStream(destination)
      ReverseProxy.streamToFileWithCallBack(jobPath+'/archive', 'GET', {}, streamWriter, () => {
        done(null, {path:destination})
      })
    }).catch((error)=>{
      done(error)
    })
  }

  queueGetArchive(orthancIds,transcoding){
    return this.queue.add('create-archive', {orthancIds, transcoding}).then((job)=>{
      this._jobs[job.id] = job
      return job
    })
  }
}

module.exports = OrthancQueue