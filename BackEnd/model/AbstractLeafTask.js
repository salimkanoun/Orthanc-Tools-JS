const AbstractTask = require('./AbstractTask')

class AbstractLeafTask extends AbstractTask{
    async getProgress(){
        return (this.job? await this.job.progress():null)
    }
    async getState(){
        return (this.job? await this.job.getState():'wait')
    }
}
module.exports = AbstractLeafTask