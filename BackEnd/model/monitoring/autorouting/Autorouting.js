const Orthanc_Monitoring = require ('../Orthanc_Monitoring')
const Queue = require('promise-queue')

class Autorouting{
  constructor(monitoring){
    this.orthanc = monitoring.orthanc
    this.monitoring = monitoring
    this.monitoringStarted = false
    this.monitorJobs = this.monitorJobs.bind(this)
    this.jobQueue = new Queue(1, Infinity);
  }


}

module.exports = Autorouting