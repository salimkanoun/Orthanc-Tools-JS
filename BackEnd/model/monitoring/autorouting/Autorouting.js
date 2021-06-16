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
    for(var i = 0 ; i < autorouter.length ; i++){
      if(autorouter[i].dataValues.running===true){
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
    switch(router.condition){
      case "OR":
        for(let i=0;i<router.rules.length;i++){
          let rule_check = await this._ruleToBoolean(router.rules[i],study)
          if(rule_check){ //send to all destination
            this.sendToAETs(router.destination,orthancID)
            //need to check one rule to send to destination then stop the for loop
            break
          } 
        }
        break

      case "AND":
        let failed = false
        for(let i=0;i<router.rules.length;i++){
          let rule_check = await this._ruleToBoolean(router.rules[i],study)
          if(!rule_check){ //send to all destination
            failed = true
            break
          } 
        }
        if(!failed){
          this.sendToAETs(router.destination,orthancID)
        }
        break
      default:
        throw new Error('Autorouting : Wrong condition')
    }

  }

  /**
   * Loop to send to every aet
   * @param {Array.<String>} destination aets name
   * @param {String} orthancID ressources to send to the aet
   */
  sendToAETs(destination,orthancID){
    for(let j = 0;j<destination.length;j++){
      this.orthanc.sendToAET(destination[j],[orthancID])
    }
  }

  /**
   * Convert a rule for an object into a boolean
   * @param {JSON} rule rule for the observed object rule:{value:,operator:,target:}
   * @param {JSON} object object to observe
   * @return {boolean}
   */
  _ruleToBoolean = async (rule,object) => {
    let target = object.MainDicomTags[rule.target]
    target = target.toLowerCase()
    let value = rule.value.toLowerCase()
    
    switch(rule.operator){
      case "IN":
        return target.includes(value)
      case "==":
        return target==value
      case "<=": //studyDate over or equal value
        target = target.substring(0,4)+'-'+target.substring(4,6)+'-'+target.substring(6) //adapt format YYYYMMDD to YYYY-MM-DD
        let res1 = await this.checkDate(rule.operator,target,value)
        return res1
      case ">="://studyDate under or equal value
        target = target.substring(0,4)+'-'+target.substring(4,6)+'-'+target.substring(6) //adapt format YYYYMMDD to YYYY-MM-DD
        let res2 = await this.checkDate(rule.operator,target,value)
        return res2
      default:
        throw new Error('Autorouting : Failed to find an operator for this rule: \n'+rule)
    }
  }

  /**
   * Compare two dates according to the operator
   * @param {String} operator could be >= or <=
   * @param {String} target date to compare to
   * @param {String} value reference date value
   * @returns {boolean}
   */
  checkDate = async (operator,target, value) => {
    let target_timestamp = Date.parse(target)
    let value_timestamp = Date.parse(value)

    if(operator=="<="){
      return (value_timestamp<=target_timestamp)
    }else if(operator==">="){
      return (value_timestamp>=target_timestamp)
    }else{
      throw new Error('Autorouting : Wrong operator')
    }
  }

  toJSON(){
    return {
        AutorouterService : this.monitoringStarted,
        QuededJobs : this.jobQueue.queue.length
    }
  }
}

module.exports = Autorouting