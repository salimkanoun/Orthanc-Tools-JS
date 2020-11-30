// Modules
const fs = require('fs')
const path = require('path')

// Imports
const AbstractLeafTask = require("../AbstractLeafTask");
const Exporter = require("../export/Exporter2");

let exporter = new Exporter();

class SendTask extends AbstractLeafTask{
    constructor(creator, filePath, endpoint){
        super(creator)

        this.file = {
            filePath,
            size: fs.statSync(filePath).size,
            name: path.basename(filePath)
        }
        this.endpoint = endpoint
    }

    async run(){
        this.job = await exporter.queue(this.endpoint.protocol, this.endpoint, this.file)
        return (await this.job.finished())
    }
}

module.exports = SendTask