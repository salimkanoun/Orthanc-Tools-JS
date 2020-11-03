const AbstractTask = require('../AbstractTask')
const OrthancQueue = require('../OrthancQueue')

let orthanc = new OrthancQueue();

class CreateArchiveTask extends AbstractTask{
    constructor(studies, transcoding = null){
        super()
        this.studies = studies
        this.transcoding = transcoding
    }

    async run(){
        this.job = await orthanc.queue.add('create-archive',{orthancIds:this.studies,transcoding:this.transcoding})
        return (await this.job.finished()).path
    }
}

module.exports = CreateArchiveTask