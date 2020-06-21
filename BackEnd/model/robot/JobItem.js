class JobItem {

    constructor() {
        this.Status = JobItem.STATUS_PENDING
    }

    setStatus(status){
        this.Status = status
    }

    getStatus(){
        return this.Status
    }

    toJSON(){
        return {
            ...this
        }
    }
}

JobItem.STATUS_PENDING = 'Pending'
JobItem.STATUS_RUNNING = 'Running'
JobItem.STATUS_SUCCESS = 'Success'
JobItem.STATUS_FAILURE = 'Failure'

module.exports = JobItem