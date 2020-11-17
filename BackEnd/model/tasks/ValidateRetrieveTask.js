const AbstractLeafTask = require('../AbstractLeafTask');
const OrthancQueue = require('../OrthancQueue');

const orthancQueue = new OrthancQueue()

class ValidateRetrieveTask extends AbstractLeafTask{
    constructor(creator, querryAnswer){
        super(creator)
        this.querryAnswer = querryAnswer
        this.job = null;
        this.validated = false
    }

    async run(){
        this.job = await  orthancQueue.queueValidateRetrieve(this.querryAnswer)
        await this.job.finished().then((validated)=>{
            this.validated = validated;
        })
    }
}

module.exports = ValidateRetrieveTask