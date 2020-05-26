class JobItem {

    constructor() {
        this.status = JobItem.STATUS_PENDING
    }

    setStatus(status){
        this.status = status
    }

    getStatus(){
        return this.status
    }
}

JobItem.STATUS_PENDING = 'Pending'
JobItem.STATUS_RUNNING = 'Running'
JobItem.STATUS_SUCCESS = 'Success'
JobItem.STATUS_FAILURE = 'Failure'

module.exports = JobItem