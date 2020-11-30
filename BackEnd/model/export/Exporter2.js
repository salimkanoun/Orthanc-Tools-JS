//Modules
const Queue = require('bull')
const SftpClient = require("ssh2-sftp-client") 
const FtpClient =  require("basic-ftp" )
const tls = require("tls") 
const {createClient} = require("webdav")
const path = require('path')
const fs = require('fs')
const Certificate = require('./Certificate')

const ftp = new FtpClient.Client()

let instance
class Exporter{
    constructor(){
        //Singleton Logique
        if(instance)return instance
        instance = this

        this._jobs = {}

        //Declaration for the send queue
        this._sendQueue = new Queue('send',{
            redis:{
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD
            }
        })

        this._sendQueue.on('progress', async (job,data)=>{
            this._jobs[job.id]._progress = await job.progress()
        })

        //Adding a processor for ftp  export tasks  
        this._sendQueue.process('send-over-ftp', Exporter._sendOverFtp)

        //Adding a processor for sftp  export tasks  
        this._sendQueue.process('send-over-sftp', Exporter._sendOverSftp)

        //Adding a processor for webdav  export tasks  
        this._sendQueue.process('send-over-webdav', Exporter._sendOverWebdav)

        Certificate.getAllCertificate().then((certificates)=>{
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
        let endpoint = job.data.endpoint
        let archive = job.data.archive
        
        //Opening the ftp connecttion
        await ftp.access(endpoint).then(async()=>{
            //Start tracking
            ftp.trackProgress(info=>{
                job.progress(info.bytesOverall/archive.size*100)
            });
            //Start Uploading
            await ftp.uploadFrom(archive.filePath, path.join(endpoint.targetFolder,  archive.name))
        })
        done()
    }

    static async _sendOverSftp(job,done){
        let endpoint = job.data.endpoint
        let archive = job.data.archive

        const sftp = new SftpClient();

        //Creating the sftp connection
        await sftp.connect(endpoint).then(()=>{
            //Starting the transfer
            sftp.fastPut(archive.filePath,path.join(endpoint.targetFolder, archive.name),{
                step:  (total_transferred, chunk, total)=>{
                    job.progress(total_transferred/archive.size*100);
                }
            }).then(()=>sftp.end())
        })
        done()
    }

    static async _sendOverWebdav(job,done){
        let endpoint = job.data.endpoint
        let archive = job.data.archive


        try {
            //Creating the conncetion
            const client = createClient(endpoint.url,
            {
                username: endpoint.username,
                password: endpoint.password,
                digest: endpoint.digest
            })
            //Transfering archive
            let rs = fs.createReadStream(archive.filePath,{autoClose:true})
            await new Promise((resolve,reject)=>{
                //Monitoring the progress
                let sent = 0
                rs.on('data', (chunk)=>{
                    sent += chunk.length
                    job.progress(sent/archive.size*100).catch((err=>console.error(err)))
                })
                rs.on('end', resolve)
                rs.on('error', reject)
                try {
                    let ws = client.createWriteStream(path.join(endpoint.targetFolder,archive.name))
                    rs.pipe(ws)
                } catch (error) {
                    console.error(error)
                }
            })
        } catch (error) {
            console.error(error)
        }

        done()
    }

    queue(protocol, endpoint, archive){
        let formatedEndpoint
        switch (protocol) {
            case 'ftp':
                formatedEndpoint = endpoint.ftpOptionFormat()
                break;
            case 'sftp':
                formatedEndpoint = endpoint.sftpOptionFormat()
                break;
            case 'webdav':
                formatedEndpoint = endpoint.webdavOptionFormat()
                break;
            default:
                break;
        }
        return this._sendQueue.add({'ftp':'send-over-ftp','sftp':'send-over-sftp','webdav':'send-over-webdav'}[protocol],
            {endpoint:formatedEndpoint,archive}).then((job)=>{
                this._jobs[job.id] = job
                return job
            })

        
    }


}


module.exports = Exporter