const {ExportTask ,CREATING,PENDING_SENDING,SENDING, CREATION_ERROR, SEND_ERROR, SENT, PROTOCOL_FTP,PROTOCOL_SFTP,PROTOCOL_FTPS,PROTOCOL_WEBDAV} = require( "./ExportTask");
const Orthanc = require("../Orthanc")
const fs = require("fs")
const SftpClient = require("ssh2-sftp-client") 
const FtpClient =  require("basic-ftp" )
const tls = require("tls") 
const path = require("path")
const {createClient} = require("webdav")

const ftp = new FtpClient.Client()

const ftpConnectionOption = {
    host: 'localhost',
    port: '22',
    username: 'legrand',
    password: 'Dnmts!',
    targetFolder : '/home/legrand/test',
    protocol : 'ftps',
    privateKey : true,
    privateKeyPassPhrase : 'devellopement'
}

const webdavConnectionOption = {
    host: 'http://localhost/webdav',
    username: 'alex',
    password: 'alex',
    targetFolder : '',
    digest: false
}

let instance
class Exporter{
    constructor(){
        if(!instance){
            instance = this

            this.orthanc = new Orthanc()

            this.taskMap = {}
            this._sending = false;
            this._sendTaskQueue = []



            // tls hack to allow CA to be add
            const origCreateSecureContext = tls.createSecureContext
            tls.createSecureContext = options => {
                const context = origCreateSecureContext(options)
                try {
                    const pem = fs
                    .readFileSync(path.join(__dirname, '..', 'data', 'certificates', 'rootCA.crt'), { encoding: "ascii" })
                    .replace(/\r\n/g, "\n");

                    const certs = pem.match(/-----BEGIN CERTIFICATE-----\n[\s\S]+?\n-----END CERTIFICATE-----/g)

                    certs.forEach(cert => {
                        context.context.addCACert(cert.trim())
                    })

                } catch (error) {

                }
                return context;
            };

        }
        return instance
    }

    async _sendArchives(){
        if(this._sending)return;
        this._sending = true;

        while (this._sendTaskQueue.length) {
            let task = this._sendTaskQueue.pop()
            task.status = SENDING
            task.sent = 0;
            
            let promise;
            switch (task.protocol) {
                case PROTOCOL_WEBDAV:
                    promise = this._webdavSend(task);
                    break;
                case PROTOCOL_FTP:
                case PROTOCOL_FTPS:
                    promise = this._ftpSend(task);
                    break;
                case PROTOCOL_SFTP:
                    promise = this._sftpSend(task);
                    break;
                default:
                    break;
            }

            // Upon completion or sending faillure the task is dereference and replace only a status to reduce memorie cost; 
            await promise.then(()=>{task.status = SENT}).catch(e => {
                console.error(e);
                task.status = SEND_ERROR
            })
        }

        this._sending = false 
    }


    _ftpSend(task){
        return ftp.access({
            host : ftpConnectionOption.host,
            user : ftpConnectionOption.username,
            password : ftpConnectionOption.password,
            secure : ftpConnectionOption.protocol==="ftps" 
        }).then(async()=>{
            // Manage tracking
            ftp.trackProgress((ftpConnectionOption.protocol==="ftp"?task.getFtpProgressListener():task.getFtpsProgressListener()));
            await ftp.uploadFrom(task.path, ftpConnectionOption.targetFolder + task.name)
        })
    }

    _sftpSend(task){
        let connectioOptions = (ftpConnectionOption.privateKey?
            {
                host: ftpConnectionOption.host,
                port: ftpConnectionOption.port,
                username: ftpConnectionOption.username,
                privateKey: fs.readFileSync(path.join(__dirname, '..', 'data', 'private_key', 'id_rsa')),
                passphrase: ftpConnectionOption.privateKeyPassPhrase
            }:
            {
                host: ftpConnectionOption.host,
                port: ftpConnectionOption.port,
                username: ftpConnectionOption.username,
                password: ftpConnectionOption.password
            }
        )

        const sftp = new SftpClient();

        //Creating the sftp connection
        return sftp.connect(connectioOptions).then(()=>{
            sftp.fastPut(task.path,ftpConnectionOption.targetFolder+task.name,{
                step: task.getSftpProgressListener()
            }).then(()=>sftp.end())
        })
    }

    _webdavSend(task){
        const client = createClient(
            webdavConnectionOption.host,
            {
                username: webdavConnectionOption.username,
                password: webdavConnectionOption.password,
                digest: webdavConnectionOption.digest
            })
        
        let rs = fs.createReadStream(task.path,{autoClose:true})
        return new Promise((resolve,reject)=>{
            rs.pipe(client.createWriteStream(webdavConnectionOption.targetFolder+task.name))
            rs.on('data', task.getWebDavProgressListener())
            rs.on('end', resolve)
            rs.on('error', reject)
        })
        
    }

    _queueForSend(task){
        task.status = PENDING_SENDING
        this._sendTaskQueue.unshift(task)
        this._sendArchives()
    }

    ftpExport(ids){
        let task = new ExportTask(ftpConnectionOption.protocol)
        task.status = CREATING
        this.taskMap[task.uuid] = task
        this.orthanc.getArchiveDicom(ids).then(path=>{
            task.setArchive(path)
            this._queueForSend(task)
        }).catch(
            (e)=>{
                task.status = CREATION_ERROR
                throw(e)
            }
        )
        return task.uuid; 
    }

    webdavExport(ids){
        let task = new ExportTask(PROTOCOL_WEBDAV)
        task.status = CREATING
        this.taskMap[task.uuid] = task
        this.orthanc.getArchiveDicom(ids).then((path)=>{
            task.setArchive(path)
            this._queueForSend(task)
        }).catch(
            (e)=>{
                task.status = CREATION_ERROR
                throw(e)
            }
        )
        return task.uuid; 
    }
}

module.exports = {Exporter}