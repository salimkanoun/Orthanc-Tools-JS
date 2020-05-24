const Job = require('./Job')
const Options = require('../Options')

class JobRetrieve extends Job{

    constructor(username, orthancObject){
        super(Job.TYPE_RETRIEVE, username)
        this.orthancObject = orthancObject
        
    }

    async getScheduleTimeFromOptions () {
        const optionsParameters = await Options.getOptions()
        return {
          hour: optionsParameters.hour,
          min: optionsParameters.min
        }
    }

    async storeAetDestination() {
        this.aetDestination = await this.orthancObject.getOrthancAetName()

    }

    async validateRetrieveItem(item) {

        if(item.level === OrthancQueryAnswer.LEVEL_STUDY){    
            orthancObject.buildStudyDicomQuery('', '', '', '', '', '', item.studyInstanceUID)
        }else if(item.level === OrthancQueryAnswer.LEVEL_SERIES){
            orthancObject.buildSeriesDicomQuery(item.studyInstanceUID, '', '', '', '', item.seriesInstanceUID)
        }
       
        const answerDetails = await this.orthancObject.makeDicomQuery(item.aet)
    
        if (answerDetails.length === 1) {
          return true
        }else{
          return false
        }
    
    }

    async validateRetrieveJob(){
        for(let item of this.items){
            let validation = await this.validateRetrieveItem(item)
            item.validated = validation
        }
    }

    async doRetrieveItem(item){

        item.setStatus(JobItem.STATUS_RUNNING)

        if(item.level === OrthancQueryAnswer.LEVEL_STUDY){    
            this.orthancObject.buildStudyDicomQuery('', '', '', '', '', '', item.studyInstanceUID)
        }else if(item.level === OrthancQueryAnswer.LEVEL_SERIES){
            this.orthancObject.buildSeriesDicomQuery(item.studyInstanceUID, '', '', '', '', item.seriesInstanceUID)
        }
    
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

    async doRetrieve () {
        this.status = Job.STATUS_RUNNING

        //Check that all items have been validated
        this.items.forEach(item =>{
            if(!item.validated){
                throw "Non validated Items in Retrieve Job"
            }
        })

        for(let item of this.items){
            await this.doRetrieveItem(item)
        }

        this.status = Job.STATUS_FINISHED
    }

    async execute() {
        const currentJob = this

        if (this.scheduledJob !== undefined) {
            this.scheduledJob.cancel()
        }

        let scheduleTime = await this.getScheduleTimeFromOptions()

        const scheduledJob = schedule.scheduleJob(scheduleTime.min + ' ' + scheduleTime.hour + ' * * *', async function () {
            await currentJob.storeAetDestination()
            currentJob.doRetrieve()
        })

        this.scheduledJob = scheduledJob
    }

}

export default JobRetrieve