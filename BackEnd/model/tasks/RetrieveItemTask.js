const AbstractLeafTask = require("../AbstractLeafTask");
const OrthancQueue = require("../OrthancQueue");
const orthancQueue = new OrthancQueue();


class RetrieveItemTask extends AbstractLeafTask{
    constructor(creator, querryAnswer){
        super(creator)

        this.job = null;

        this.querryAnswer = querryAnswer;
        this.retrievedOrthancId = '';
    }

    async getContent(){
        return {
            ...this.querryAnswer,
            retrievedOrthancId: this.retrievedOrthancId
        }
    }

    async run(){
        this.job = await orthancQueue.queueRetrieveItem(this.querryAnswer)
        await this.job.finished().then((newId)=>{this.retrievedOrthancId = newId});
    }
}

module.exports = RetrieveItemTask