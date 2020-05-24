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
            if(itemStatus === RetrieveItem.STATUS_PENDING){
                numberOfPendingItems++
            }else if(itemStatus === RetrieveItem.STATUS_RUNNING){
                numberOfRunningItems++
            }else if(itemStatus === RetrieveItem.STATUS_SUCCESS){
                numberOfSuccessItems++
            }else if(itemStatus === RetrieveItem.STATUS_FAILURE){
                numberOfFailureItems++
            }

        })

        return{
            [RetrieveItem.STATUS_PENDING] : numberOfPendingItems,
            [RetrieveItem.STATUS_RUNNING] : numberOfRunningItems,
            [RetrieveItem.STATUS_SUCCESS] : numberOfSuccessItems,
            [RetrieveItem.STATUS_FAILURE] : numberOfFailureItems,
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