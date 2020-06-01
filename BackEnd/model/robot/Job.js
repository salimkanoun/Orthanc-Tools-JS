const JobItem = require('./JobItem')
class Job{

    constructor(type, username){
        this.type = type
        this.username = username
        this.items = []
        this.status = Job.STATUS_PENDING
    }

    addItem(item){
        this.items.push(item)
    }

    removeItem(index){
        this.items.splice(index, 1)
    }

    getItems(){
        return this.items
    }

    getStatus(){
        return this.status
    }
    
    execute(){
        throw('Execute should be implemented')
    }

    getProgression(){
        let numberOfPendingItems = 0
        let numberOfRunningItems = 0
        let numberOfSuccessItems = 0
        let numberOfFailureItems = 0

        this.items.forEach(item => {

            let itemStatus = item.getStatus()
            if(itemStatus === JobItem.STATUS_PENDING){
                numberOfPendingItems++
            }else if(itemStatus === JobItem.STATUS_RUNNING){
                numberOfRunningItems++
            }else if(itemStatus === JobItem.STATUS_SUCCESS){
                numberOfSuccessItems++
            }else if(itemStatus === JobItem.STATUS_FAILURE){
                numberOfFailureItems++
            }

        })

        this.progression = {
            [JobItem.STATUS_PENDING] : numberOfPendingItems,
            [JobItem.STATUS_RUNNING] : numberOfRunningItems,
            [JobItem.STATUS_SUCCESS] : numberOfSuccessItems,
            [JobItem.STATUS_FAILURE] : numberOfFailureItems,
        }

        return this.progression
    }

    toJSON(){

        return {
            type : this.type,
            username : this.username,
            items : this.items.map(item =>{
                return item.toJSON()
            }),
            status : this.status
        }

    }
    
}

Job.TYPE_RETRIEVE = "Retrieve"
Job.TYPE_ANONYMIZE = "Anonymize"
Job.TYPE_DELETE = "Delete"

Job.STATUS_PENDING = 'Pending'
Job.STATUS_RUNNING = 'Running'
Job.STATUS_FINISHED = 'Finished'

module.exports = Job