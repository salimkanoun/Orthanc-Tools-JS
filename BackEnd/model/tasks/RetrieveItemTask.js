const AbstractLeafTask = require("../AbstractLeafTask");
const OrthancQueue = require("../OrthancQueue");
const orthancQueue = new OrthancQueue();


class RetrieveItemTask extends AbstractLeafTask{
    constructor(creator, queryAnswer){
        super(creator)

        this.job = null;

        this.queryAnswer = queryAnswer;
        this.retrievedOrthancId = '';
    }

    async getContent(){
        return {
            ...this.queryAnswer,
            retrievedOrthancId: this.retrievedOrthancId
        }
    }

    async run(){
        this.job = await orthancQueue.queueRetrieveItem(this.queryAnswer)
        await this.job.finished().then((newId)=>{this.retrievedOrthancId = newId});
    }

    async delete(){
        await this.job.remove();
    }
    
}

module.exports = RetrieveItemTask