const JobItem = require('./JobItem')

class JobItemRetrieve extends JobItem {

    constructor(queryAnswer) {
        super()
        Object.assign(this, queryAnswer)
        this.Validated = false
        this.RetrievedOrthancId = null
    }

    setRetrievedOrthancId(orthancId) {
        this.retrievedOrthancId = orthancId
    }

    getRetrievedOrthancId() {
        return this.retrievedOrthancId
    }

    getNumberOfInstances() {
        return this.numberOfSeriesRelatedInstances
    }

    toJSON(){
        return {
            ...this
        }
    }

}

module.exports = JobItemRetrieve