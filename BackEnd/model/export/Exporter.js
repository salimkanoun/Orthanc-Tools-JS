//Modules
const Queue = require('bull')
const Sftp = require('../../adapter/ssh2SftpClientAdapter')
const Ftp = require('../../adapter/basicFtpAdapter')
const Webdav = require('../../adapter/webdavAdapter')
const tls = require("tls") 
const path = require('path')
const fs = require('fs')
const Certificate = require('./Certificate')

let instance
class Exporter{
    constructor(){
        //Singleton Logique
        if(instance)return instance
        instance = this

        this._jobs = {}

        //Declaration for the send queue
        this.sendQueue = new Queue('send',{
            redis:{
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD
            }
        })
        
        //this._sendQueue.on('error',(err)=>{console.log(err)})

        this.sendQueue.isReady().then(()=>{
            //Adding a processor for ftp  export tasks  
            this.sendQueue.process('send-over-ftp', Exporter._sendOverFtp)
    
            //Adding a processor for sftp  export tasks  
            this.sendQueue.process('send-over-sftp', Exporter._sendOverSftp)
    
            //Adding a processor for webdav  export tasks  
            this.sendQueue.process('send-over-webdav', Exporter._sendOverWebdav)
        }).catch((_)=>{})



        Certificate.getAllCertificates().then((certificates)=>{
            let origCreateSecureContext = tls.createSecureContext
            tls.createSecureContext = options => {
                const context = origCreateSecureContext(options)
                try {
                    certificates.forEach((cert)=>{
                        const pem = fs
                        .readFileSync(cert.path, { encoding: "ascii" })
                        .replace(/\r\n/g, "\n");

                        const certs = pem.match(/-----BEGIN CERTIFICATE-----\n[\s\S]+?\n-----END CERTIFICATE-----/g)

                        certs.forEach(cert => {
                            context.context.addCACert(cert.trim())
                        })
                    })
                } catch (error) {

                }
                return context;
            }
        })

        
    }

    static async _sendOverFtp(job,done){
        Ftp.sendOverFtp(job,done)
    }

    static async _sendOverSftp(job,done){
        Sftp.sendOverSftp(job,done)
    }

    static async _sendOverWebdav(job,done){
        Webdav.sendOverWebdav(job,done)
    }

    async queue(protocol, endpoint, archive){
        let formatedEndpoint
        switch (protocol) {
            case 'ftp':
                formatedEndpoint = endpoint.ftpOptionFormat()
                break;
            case 'sftp':
                formatedEndpoint = await endpoint.sftpOptionFormat()
                break;
            case 'webdav':
                formatedEndpoint = endpoint.webdavOptionFormat()
                break;
            default:
                break;
        }
        return this.sendQueue.add({'ftp':'send-over-ftp','sftp':'send-over-sftp','webdav':'send-over-webdav'}[protocol],
            {endpoint:formatedEndpoint,archive}).then((job)=>{
                this._jobs[job.id] = job
                return job
            }) 
    }

    async uploadFile(taskId, endpoint, filePath){
        let formatedEndpoint
        switch (endpoint.protocol) {
            case 'ftp':
                formatedEndpoint = endpoint.ftpOptionFormat()
                break;
            case 'sftp':
                formatedEndpoint = await endpoint.sftpOptionFormat()
                break;
            case 'webdav':
                formatedEndpoint = endpoint.webdavOptionFormat()
                break;
            default:
                break;
        }
        let file = {
            path : filePath,
            name : path.basename(filePath),
            size : await new Promise((resolve,reject)=>{
                fs.stat(filePath,(err, stats)=>{
                    if(!err) resolve(stats.size);
                    else reject(err);
                })
            })
        }
        this.sendQueue.add({'ftp':'send-over-ftp','sftp':'send-over-sftp','webdav':'send-over-webdav'}[endpoint.protocol],
            {taskId, endpoint:formatedEndpoint,file})
        return taskId;
    }

    async getUploadJobs(taskId){
        let jobs = await this.sendQueue.getJobs(["delayed", "completed", "active", "paused", "waiting"]);
        return jobs.filter(job=>job.data.taskId === taskId);
    }


}


module.exports = Exporter