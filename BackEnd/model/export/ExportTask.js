const uuid = require('../../utils/uuid')
const fs =  require("fs")
const path = require("path")



class ExportTask{
    constructor(protocol){
        this.uuid = uuid.getUuid()
        if(![PROTOCOL_FTP,PROTOCOL_FTPS,PROTOCOL_SFTP,PROTOCOL_WEBDAV].includes(protocol)){
            throw("Unsuported export protocol")
        }
        this.protocol = protocol
        this.status = CREATING
    }

    setArchive(archivePath){
        
        this.name = path.basename(archivePath)
        fs.stat(archivePath, (err,stats)=>{this.size = stats.size})
        this.path = archivePath
    }

    getWebDavProgressListener(){
        return (chunk)=>{
            this.sent += chunk.length;
        }
    }
    
    getSftpProgressListener(){
        return (total_transferred, chunk, total)=>{
            this.sent = total_transferred;
        }
    }
    
    getFtpProgressListener(){
        return info=>{
            this.sent = info.bytesOverall
        }
    }

    getSendable(){
        console.log(this)
        return {
            uuid: this.uuid,
            status: this.status,
            sent: this.sent,
            size: this.size 
        }
    }
}

const CREATING = 0, PENDING_SENDING = 1, SENDING = 2, SENT = 3, CREATION_ERROR = -1, SEND_ERROR = -2

const PROTOCOL_SFTP = 'sftp', PROTOCOL_FTP = 'ftp', PROTOCOL_FTPS = 'ftps', PROTOCOL_WEBDAV = 'webdav'

module.exports = {ExportTask ,CREATING,PENDING_SENDING,SENDING, CREATION_ERROR, SEND_ERROR, SENT, PROTOCOL_FTP,PROTOCOL_SFTP,PROTOCOL_FTPS,PROTOCOL_WEBDAV}