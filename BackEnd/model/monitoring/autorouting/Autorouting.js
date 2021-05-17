const Orthanc_Monitoring = require ('../Orthanc_Monitoring')
const Queue = require('promise-queue')
const Autorouter = require('../../Autorouters')

class Autorouting{
  constructor(monitoring){
    this.orthanc = monitoring.orthanc
    this.monitoring = monitoring
    this.monitoringStarted = false
    this.monitorJobs = this.monitorJobs.bind(this)
    this.jobQueue = new Queue(1, Infinity);
  }

  setSettings = async () => {
    this.autorouters_series= []
    this.autorouters_studies = []
    this.autorouters_patients = []
    //put on variable all autorouters that are enabled
    let autorouter = await Autorouter.getAllAutorouters()
    for(var i = 0 ; i < autorouter.lentgh ; i++){
      if(autorouter[i].running==true){
        switch (autorouter[i].target){
          case 'Patients':
            this.autorouters_patients.push(autorouter[i])  
            break
          case 'Studies':
            this.autorouters_studies.push(autorouter[i])
            break
          case 'Series':
            this.autorouters_series.push(autorouter[i])
            break
          default:
            break
        }
      }
    }
  }

  startAutorouting = async () => {
    if(this.monitoringStarted) return
    
    this.setSettings()
    this.monitoringStarted=true
    this._makeListener()
  }

  autoStartIfNeeded = async () => {
    await this.setSettings()
    this.startAutorouting()
  }

  _makeListener = () => {
    if(this.autorouters_patients){

    }
    if(this.autorouters_studies){

    }
    if(this.autorouters_series){
      
    }
  }


}

module.exports = Autorouting