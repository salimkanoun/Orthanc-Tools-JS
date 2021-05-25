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


  /** 
  * Make the settings for the monitoring.
  * Recuperate all autorouters rules and divide them into 3 arrays
  */
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

  /**
   * Start autourouter
   */
  startAutorouting = async () => {
    if(this.monitoringStarted) return
    
    this.setSettings()
    this.monitoringStarted=true
    this._makeListener()
  }

    /**
   * AutoStart the autorouter if needed
   */
  autoStartIfNeeded = async () => {
    await this.setSettings()
    this.startAutorouting()
  }

  /**
   * Set the event listerners and dispatch the jobs
   */
  _makeListener = () => {
    this.monitoring.on('StablePatient',(orthancID)=>{
      this._jobDispatcher(orthancID,'Patient')
    })
    this.monitoring.on('StableStudy',(orthancID)=>{
      this._jobDispatcher(orthancID,'Study')
    })
    this.monitoring.on('StableSeries',(orthancID)=>{
      this._jobDispatcher(orthancID,'Series')
    })
  }

  /**
   * Dispatch the different jobs for each rules when a new event commes
   * @param {String} orthancID OrthancID of the target
   * @param {String} changeType type of the target
   */
  _jobDispatcher = async (orthancID,changeType) => {
    switch(changeType){
      case 'Patient':
        let patient = await this.orthanc.getOrthancDetails('patients', orthancID)
        let studies = await this.orthanc.getStudiesDetailsOfPatient(orthancID)
        for(let i = 0;i<this.autorouters_patients.length;i++){
          this.jobQueue.add(async ()=>{
            await this._processPatient(orthancID,this.autorouters_patients[i].rule,patient,studies)
          })
        }
        break
      case 'Study':
        let study = await this.orthanc.getOrthancDetails('studies', orthancID)
        let patient = await this.orthanc.getOrthancDetails('patients', study.ParentPatient)
        let series = await this.orthanc.getSeriesDetailsOfStudy(orthancID)
        for(let i = 0;i<this.autorouters_studies.length;i++){
          this.jobQueue.add(async ()=>{
            await this._processStudy(orthancID,this.autorouters_series[i].rule,study,patient,series)
          })
        }
        break
      case 'Series':
        let series = await this.orthanc.getOrthancDetails('series', orthancID)
        for(let i = 0;i<this.autorouters_series.length;i++){
          this.jobQueue.add(async ()=>{
            await this._processSeries(orthancID,this.autorouters_series[i].rule,series)
          })
        }
        break
    }
  }

  /**
   * Process a new Patient event
   * @param {String} orthancID OrthancID of the Patient
   * @param {JSON} rule Rule to check for this Patient
   * @param {JSON} patient Patient details
   * @param {JSON} studies Study attached to the Patient
   */
  _processPatient = async (orthancID,rule,patient,studies) => {

  }
  /**
   * Process a new Study event
   * @param {String} orthancID OrthancID of the Study
   * @param {JSON} rule Rule to check for this Study
   * @param {JSON} study Study details
   * @param {JSON} patient Patient attached to the Study
   * @param {Array} series Series attached to the Study
   */
  _processStudy = async (orthancID,rule,study,patient,series) => {
    
  }
  /**
   * Process new Series event
   * @param {String} orthancID OrthancID of the Series
   * @param {JSON} rule Rule to check for this Series
   * @param {JSON} series Series details
   */
  _processSeries = async (orthancID,rule,series) => {
    
  }

  /**
   * Convert a rule for an object into a boolean
   * @param {JSON} rule rule for the observed object
   * @param {JSON} object object to observe
   * @return {boolean}
   */
  _ruleToBoolean = (rule,object) => {
    switch(rule.operator){
      case "IN":
        break
      case "==":
        break
      default:
        break
    }
  }
}

module.exports = Autorouting