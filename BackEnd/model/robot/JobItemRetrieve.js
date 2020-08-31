const JobItem = require('./JobItem')

class JobItemRetrieve extends JobItem {

    constructor(queryAnswer) {
        super()
        Object.assign(this, queryAnswer)
        this.Validated = false
        this.RetrievedOrthancId = null
        this.Key = Math.random()
    }

    setRetrievedOrthancId(orthancId) {
        this.RetrievedOrthancId = orthancId
    }

    setValidation(validate){
        this.Validated = validate
    }

    getRetrievedOrthancId() {
        return this.RetrievedOrthancId
    }

    getNumberOfInstances() {
        return this.NumberOfSeriesRelatedInstances
    }

}

module.exports = JobItemRetrieve