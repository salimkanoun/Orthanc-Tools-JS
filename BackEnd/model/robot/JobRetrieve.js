const Job = require('./Job')
const Options = require('../Options')
const schedule = require('node-schedule')
const OrthancQueryAnswer = require('../queries-answer/OrthancQueryAnswer')
const JobItem = require('./JobItem')

class JobRetrieve extends Job {

    constructor(username, orthancObject){
        super(Job.TYPE_RETRIEVE, username, orthancObject)
        this.validation = JobRetrieve.VALIDATION_NOT_DONE
    }

    setProjectName(projectName){
        this.projectName = projectName
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
       
        const answerDetails = await this.orthancObject.makeDicomQuery(item.OriginAET)
    
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
        this.validated = JobRetrieve.VALIDATION_PENDING
        for(let item of this.items){
            let validation = await this.validateRetrieveItem(item)
            item.setValidation(validation)
        }
        //If validated execute the robot
        if(this.isValidated()) {
            this.validation = JobRetrieve.VALIDATION_SUCCESS
            this.execute()
            return true
        }else {
            this.validation = JobRetrieve.VALIDATION_FAILED
            return false
        }
    }

    /**
     * Prepare Orthanc Object Query according to Item QueryLevel
     * @param {JobItemRetrieve} item 
     */
    buildDicomQuery(item){
        console.log(item)
        if(item.Level === OrthancQueryAnswer.LEVEL_STUDY){    
            this.orthancObject.buildStudyDicomQuery('', '', '', '', '', '', item.StudyInstanceUID)
        }else if(item.Level === OrthancQueryAnswer.LEVEL_SERIES){
            this.orthancObject.buildSeriesDicomQuery(item.studyInstanceUID, '', '', '', '', item.SeriesInstanceUID)
        }
    }

    async doRetrieveItem(item){

        item.setStatus(JobItem.STATUS_RUNNING)

        this.buildDicomQuery(item)
    
        const answerDetails = await this.orthancObject.makeDicomQuery(item.OriginAET)
    
        const answer = answerDetails[0]
        const retrieveAnswer = await this.orthancObject.makeRetrieve(answer.AnswerId, answer.AnswerNumber, this.aetDestination, true)
        const orthancResults = await this.orthancObject.findInOrthancByUid(retrieveAnswer['Query'][0]['0020,000d'])
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
            if(!item.Validated){
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

    getProgression(){
        let numberOfPendingItems = 0
        let numberOfRunningItems = 0
        let numberOfSuccessItems = 0
        let numberOfFailureItems = 0
        let totalInstances = 0

        this.items.forEach(item => {

            let itemStatus = item.getStatus()
            if(itemStatus === JobItem.STATUS_PENDING){
                numberOfPendingItems += item.NumberOfSeriesRelatedInstances
            }else if(itemStatus === JobItem.STATUS_RUNNING){
                numberOfRunningItems += item.NumberOfSeriesRelatedInstances
            }else if(itemStatus === JobItem.STATUS_SUCCESS){
                numberOfSuccessItems += item.NumberOfSeriesRelatedInstances
            }else if(itemStatus === JobItem.STATUS_FAILURE){
                numberOfFailureItems += item.NumberOfSeriesRelatedInstances
            }
            totalInstances += item.NumberOfSeriesRelatedInstances

        })

        this.progression = {
            [JobItem.STATUS_PENDING] : numberOfPendingItems,
            [JobItem.STATUS_RUNNING] : numberOfRunningItems,
            [JobItem.STATUS_SUCCESS] : numberOfSuccessItems,
            [JobItem.STATUS_FAILURE] : numberOfFailureItems,
            TotalInstances : totalInstances
        }

        return this.progression
    }

    toJSON() {
        return {
            items : this.items.map(item =>{
                return item.toJSON()
            }),
            status : this.status,
            username : this.username,
            projectName : this.projectName,
            validation : this.validation,
            progression : this.getProgression()
        }
    }



}

JobRetrieve.VALIDATION_NOT_DONE = "Not Done"
JobRetrieve.VALIDATION_FAILED = "Failed"
JobRetrieve.VALIDATION_PENDING = "Validating"
JobRetrieve.VALIDATION_SUCCESS = "Validated"

module.exports = JobRetrieve