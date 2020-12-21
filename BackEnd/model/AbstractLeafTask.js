const AbstractTask = require('./AbstractTask')

/**
 * Represents a task to be executed by Orthanc Tool js that interfaces directly with bull
 */
class AbstractLeafTask extends AbstractTask{
    /**
     * returns the current progress of the task
     */
    async getProgress(){
        //Get the progress of the bull job
        return (this.job? await this.job.progress():null)
    }

    /**
     * returns the current state of the task
     */
    async getState(){
        //Get the state of the bull job
        return (this.job? await this.job.getState():'wait')
    }

    /**
     * Stops the task
     */
    async delete(){
        if(this.job){
            // removing the bull job from the queue
            await this.job.remove()
        }
    }
}
module.exports = AbstractLeafTask