const JobItem = require('./JobItem')

class JobItemDelete extends JobItem {

    constructor(seriesOrthancID){
        super()
        this.seriesOrthancID = seriesOrthancID
    }

}

module.exports = JobItemDelete