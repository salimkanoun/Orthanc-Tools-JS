class JobItem {

    constructor() {
        this.status = RetrieveItem.STATUS_PENDING
    }

    setStatus(status){
        this.status = status
    }

    getStatus(){
        return this.status
    }
}

RetrieveItem.STATUS_PENDING = 'Pending'
RetrieveItem.STATUS_RUNNING = 'Running'
RetrieveItem.STATUS_SUCCESS = 'Success'
RetrieveItem.STATUS_FAILURE = 'Failure'