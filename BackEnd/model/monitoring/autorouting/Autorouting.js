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
   * @param {String} targetType type of the target ('Patient','Study','Series')
   */
  _jobDispatcher = async (orthancID,targetType) => {
    switch(targetType){
      case 'Patient':
        let patient = await this.orthanc.getOrthancDetails('patients', orthancID)
        let studies = await this.orthanc.getStudiesDetailsOfPatient(orthancID)
        for(let i = 0;i<this.autorouters_patients.length;i++){
          this.jobQueue.add(async ()=>{
            await this._processPatient(orthancID,this.autorouters_patients[i],patient,studies)
          })
        }
        break
      case 'Study':
        let study = await this.orthanc.getOrthancDetails('studies', orthancID)
        let patient = await this.orthanc.getOrthancDetails('patients', study.ParentPatient)
        let series = await this.orthanc.getSeriesDetailsOfStudy(orthancID)
        for(let i = 0;i<this.autorouters_studies.length;i++){
          this.jobQueue.add(async ()=>{
            await this._processStudy(orthancID,this.autorouters_series[i],study,patient,series)
          })
        }
        break
      case 'Series':
        let series = await this.orthanc.getOrthancDetails('series', orthancID)
        let study = await this.orthanc.getOrthancDetails('studies',series.ParentStudy)
        for(let i = 0;i<this.autorouters_series.length;i++){
          this.jobQueue.add(async ()=>{
            await this._processSeries(orthancID,this.autorouters_series[i],series,study)
          })
        }
        break
    }
  }

  /**
   * Process a new Patient event
   * @param {String} orthancID OrthancID of the Patient
   * @param {JSON} router Rules to check for this Patient
   * @param {JSON} patient Patient details
   * @param {JSON} studies Studies attached to the Patient
   */
  _processPatient = async (orthancID,router,patient,studies) => {
    for(let i=0;i<router.rules.length;i++){
      let rule_check = this._ruleToBoolean(router.rules[i],patient)
      if(rule_check){
        //code for routing to path
        break
      } 
    }
  }

  /**
   * Process a new Study event
   * @param {String} orthancID OrthancID of the Study
   * @param {JSON} router Rules to check for this Study
   * @param {JSON} study Study details
   * @param {JSON} patient Patient attached to the Study
   * @param {Array} series Series attached to the Study
   */
  _processStudy = async (orthancID,router,study,patient,series) => {
    for(let i=0;i<router.rules.length;i++){
      let rule_check = this._ruleToBoolean(router.rules[i],study)
      if(rule_check){
        //code for routing to path
        break
      } 
    }
  }

  /**
   * Process new Series event
   * @param {String} orthancID OrthancID of the Series
   * @param {JSON} router Rules to check for this Series
   * @param {JSON} series Series details
   * @param {JSON} study Study attached to the Series
   */
  _processSeries = async (orthancID,router,series,study) => {
    for(let i=0;i<router.rules.length;i++){
      let rule_check = this._ruleToBoolean(router.rules[i],series)
      if(rule_check){
        //code for routing to path
        break
      } 
    }
  }

  /**
   * Convert a rule for an object into a boolean
   * @param {JSON} rule rule for the observed object rule:{value:,operator:,target:}
   * @param {JSON} object object to observe
   * @return {boolean}
   */
  _ruleToBoolean = (rule,object) => {
    switch(rule.target){
      case 'ArrayOfKnownAET':
        break
      default:
        let target = this._findKey(object.MainDicomTags,rule.target)
        let value = rule.value
        switch(rule.operator){
          case "IN":
            return target.contains(value)
          case "==":
            return target==value
          default:
            throw new Error('Failed to find an operator for this rule: \n'+rule)
        }
        break
    }
  }

  _findKey= (obj, key) => {
    for ([k, v] of Object.entries(obj)){
        if (k == key) return v
        if (typeof v === 'object' &&  v !== null ){
            let found = findKey(v, key)
            if (found) return found
        }
    }
    
}

}

module.exports = Autorouting