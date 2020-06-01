const Job = require('./Job')
const Options = require('../Options')
const schedule = require('node-schedule')
const OrthancQueryAnswer = require('../queries-answer/OrthancQueryAnswer')
const JobItem = require('./JobItem')

class JobRetrieve extends Job {

    constructor(username, orthancObject){
        super(Job.TYPE_RETRIEVE, username)
        this.orthancObject = orthancObject
    }

    /**
     * Retrieve execution time from options
     */
    async getScheduleTimeFromOptions () {
        const optionsParameters = await Options.getOptions()
        this.scheduleTime =  {
          hour: optionsParameters.hour,
          min: optionsParameters.min
        }
    }

    /**
     * Retrieve AET Orthanc Name
     * SK : Peut etre supprimee depuis Orthanc 1.7.0
     */
    async storeAetDestination() {
        this.aetDestination = await this.orthancObject.getOrthancAetName()
    }

    /**
     * Check if Retrive Item return only One answer from source AET
     * @param {JobItemRetrieve} item 
     */
    async validateRetrieveItem(item) {

        this.buildDicomQuery(item)
       
        const answerDetails = await this.orthancObject.makeDicomQuery(item.aet)
    
        if (answerDetails.length === 1) {
          return true
        }else{
          return false
        }
    
    }

    /**
     * Loop all Item to checkValidity
     */
    async validateRetrieveJob(){
        for(let item of this.items){
            let validation = await this.validateRetrieveItem(item)
            item.validated = validation
        }
        //If validated execute the robot
        if(this.isValidated()) {
            this.execute()
            return true
        }else {
            return false
        }
    }

    /**
     * Prepare Orthanc Object Query according to Item QueryLevel
     * @param {JobItemRetrieve} item 
     */
    buildDicomQuery(item){
        if(item.level === OrthancQueryAnswer.LEVEL_STUDY){    
            this.orthancObject.buildStudyDicomQuery('', '', '', '', '', '', item.studyInstanceUID)
        }else if(item.level === OrthancQueryAnswer.LEVEL_SERIES){
            this.orthancObject.buildSeriesDicomQuery(item.studyInstanceUID, '', '', '', '', item.seriesInstanceUID)
        }
    }

    async doRetrieveItem(item){

        item.setStatus(JobItem.STATUS_RUNNING)

        this.buildDicomQuery(item)
    
        const answerDetails = await this.orthancObject.makeDicomQuery(this.aetDestination)
    
        const answer = answerDetails[0]
        const retrieveAnswer = await this.orthancObject.makeRetrieve(answer.answerId, answer.answerNumber, this.aetDestination, true)
        const orthancResults = await this.orthancObject.findInOrthancByUid(retrieveAnswer.Query[0]['0020,000d'])
        if (orthancResults.length === 1) {
            item.setStatus(JobItem.STATUS_SUCCESS)
            item.setRetrievedOrthancId(orthancResults[0].ID)
        } else {
            item.setStatus(JobItem.STATUS_FAILURE)
        }
    
    }

    /**
     * Checks that all items are validated
     */
    isValidated(){
        this.items.forEach(item =>{
            if(!item.validated){
                return false
            }
        })
        return true
    }

    async doRetrieve () {
        this.status = Job.STATUS_RUNNING

        //Check that all items have been validated
        if( !this.isValidated() ) {
            console.log('Non Validated Retrieve')
            return
        }

        for(let item of this.items){
            await this.doRetrieveItem(item)
        }

        this.status = Job.STATUS_FINISHED
    }

    async execute() {
        
        if (this.scheduledJob !== undefined) {
            this.scheduledJob.cancel()
        }
        
        await this.storeAetDestination()
        await this.getScheduleTimeFromOptions()

        const currentJob = this
        const scheduledJob = schedule.scheduleJob(this.scheduleTime.min + ' ' + this.scheduleTime.hour + ' * * *', async function () {
            currentJob.doRetrieve()
        })

        this.scheduledJob = scheduledJob
    }

}

module.exports = JobRetrieve