const AbstractLeafTask = require('../AbstractLeafTask');
const OrthancQueue = require('../OrthancQueue');

const orthancQueue = new OrthancQueue()

class ValidateRetrieveTask extends AbstractLeafTask{
    constructor(creator, queryAnswer){
        super(creator)
        this.queryAnswer = queryAnswer
        this.job = null;
        this.validated = false
    }

    async run(){
        this.job = await  orthancQueue.queueValidateRetrieve(this.queryAnswer)
        await this.job.finished().then((validated)=>{
            this.validated = validated;
        })
    }
}

module.exports = ValidateRetrieveTask