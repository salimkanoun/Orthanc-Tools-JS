const Orthanc_Monitoring = require ('../Orthanc_Monitoring')
const Queue = require('promise-queue')
const Autorouter = require('../../Autorouters')
const Options = require('../../Options')

class Autorouting {

  constructor(monitoring) {
    this.orthanc = monitoring.orthanc
    this.monitoring = monitoring
    this.monitoringStarted = false
    this.jobQueue = new Queue(1, Infinity);
  }

  /** 
  * Make the settings for the monitoring.
  * Recuperate all autorouters rules and divide them into 3 arrays
  */
  setSettings = async () => {
    let options = await Options.getOptions()
    this.autoStart = options.autorouter_started
    this.autorouters = []
    //put on variable all autorouters that are enabled
    let autorouter = await Autorouter.getAllAutorouters()
    for(var i = 0 ; i < autorouter.lentgh ; i++){
      if(autorouter[i].running==true){
        this.autorouters.push(autorouter[i])
      }
    }
  }

  /**
   * Autostart the autorouter if the option tells it
   */
  autoStartIfNeeded = async () => {
    await this.setSettings()
    if(this.autoStart) this.startAutorouting()
  }

  /**
   * Start autourouter
   */
  startAutorouting = async () => {
    if(this.monitoringStarted) return
    
    await this.setSettings()
    this.monitoringStarted=true
    this._makeListener()
    this.monitoring.startMonitoringService('Autorouting')
  }

  /**
   * Set the event listerners and dispatch jobs (in case of multiple target event possibilities)
   */
  _makeListener = () => {
    this.monitoring.on('StableStudy',(orthancID)=>{
      this._jobDispatcher(orthancID)
    })
  }

  /**
   * Remove the event listener that dispatch jobs
   */
  _removeListener = () => {
    this.monitoring.removeListener('StableStudy',(orthancID)=>{
      this._jobDispatcher(orthancID)
    })
  }

  /**
   * Stop the autorouter
   */
  stopAutorouting = async () => {
    this.monitoringStarted = false
    this._removeListener()
    this.monitoring.stopMonitoringService('Autorouting')
  }

  /**
   * Dispatch the different jobs for each rules when a new event commes
   * @param {String} orthancID OrthancID of the target
   */
  _jobDispatcher = async (orthancID) => {
    let study = await this.orthanc.getOrthancDetails('studies', orthancID)
    for(let i = 0;i<this.autorouters.length;i++){
      this.jobQueue.add(async ()=>{
        await this._process(orthancID,this.autorouters[i],study)
      })
    }
  }

  /**
   * Process a StableStudy event
   * @param {String} orthancID OrthancID of the Study
   * @param {JSON} router router config for this study to check
   * @param {JSON} study Study details
   */
  _process = async (orthancID,router,study) => {
    for(let i=0;i<router.rules.length;i++){
      let rule_check = this._ruleToBoolean(router.rules[i],study)
      if(rule_check){ //send to all destination
        for(let j = 0;j<router.destination.length;j++){
          this.orthanc.sendToAET(router.destination[j],[orthancID])
        }//need to check one rule to send to destination then stop the for loop
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
    let target = this._findKey(object.MainDicomTags,rule.target)
    target = target.toLowerCase()
    let value = rule.value.toLowerCase()
    switch(rule.operator){
      case "IN":
        return target.contains(value)
      case "==":
        return target==value
      default:
        throw new Error('Failed to find an operator for this rule: \n'+rule)
    }
  }

  /**
   * Find the value associate to a key of a JSON Object
   * @param {JSON} obj object to check
   * @param {String} key key to find in the object
   * @returns {String} value of the target key
   */
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