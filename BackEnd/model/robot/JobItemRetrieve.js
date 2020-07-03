const JobItem = require('./JobItem')

class JobItemRetrieve extends JobItem {

    constructor(queryAnswer) {
        super()
        Object.assign(this, queryAnswer)
        this.Validated = false
        this.RetrievedOrthancId = null
    }

    setRetrievedOrthancId(orthancId) {
        this.RetrievedOrthancId = orthancId
    }

    getRetrievedOrthancId() {
        return this.RetrievedOrthancId
    }

    getNumberOfInstances() {
        return this.NumberOfSeriesRelatedInstances
    }

}

module.exports = JobItemRetrieve