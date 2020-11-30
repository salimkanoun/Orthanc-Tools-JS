const AbstractLeafTask = require('../AbstractLeafTask')
const OrthancQueue = require('../OrthancQueue')

let orthanc = new OrthancQueue();

class CreateArchiveTask extends AbstractLeafTask{
    constructor(creator, studies, transcoding = null){
        super(creator)
        this.studies = studies
        this.transcoding = transcoding
    }

    async run(){
        this.job = await orthanc.queueGetArchive(this.studies,this.transcoding)
        return (await this.job.finished()).path
    }
}

module.exports = CreateArchiveTask