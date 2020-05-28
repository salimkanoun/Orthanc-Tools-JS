const JobItem = require('./JobItem')

class JobItemRetrieve extends JobItem {

    constructor(queryAnswer) {
        super()
        Object.assign(this, queryAnswer)
        this.validated = false
        this.retrievedOrthancId = null
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

}

module.exports = JobItemRetrieve