//////////////////////////////////////////////////////////////////////
////////////////////////////// Imports ///////////////////////////////
//////////////////////////////////////////////////////////////////////

const Orthanc = require("../model/Orthanc")
const FtpClient = require("basic-ftp")
const SftpClient = require("ssh2-sftp-client")
const {createClient} = require("webdav")
const path = require("path")
const fs = require("fs")
const { error } = require("console")
const tls = require('tls')
const { connected } = require("process")


//////////////////////////////////////////////////////////////////////
////////////////////////////// Instances /////////////////////////////
//////////////////////////////////////////////////////////////////////

const ftp = new FtpClient.Client()
const sftp = new SftpClient()
const orthancInstance = new Orthanc()

// tls hack to allow CA to be added 
const origCreateSecureContext = tls.createSecureContext
tls.createSecureContext = options => {
  const context = origCreateSecureContext(options)

  const pem = fs
    .readFileSync(path.join(__dirname, '..', 'data', 'certificates', 'rootCA.crt'), { encoding: "ascii" })
    .replace(/\r\n/g, "\n");

  const certs = pem.match(/-----BEGIN CERTIFICATE-----\n[\s\S]+?\n-----END CERTIFICATE-----/g)

  if (!certs) {
    throw new Error(`Could not parse certificate ./rootCA.crt`)
  }

  certs.forEach(cert => {
    context.context.addCACert(cert.trim())
  })

  return context;
};


const exportProcesses = {}

//////////////////////////////////////////////////////////////////////
/////////////// Options TODO : integreate to options /////////////////
//////////////////////////////////////////////////////////////////////

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

class ExportTask{
    constructor(archivePath){
        this.uuid = -1
        
        let splitedPath =  archivePath.split('/')
        this.archiveName = splitedPath[splitedPath.length -1]
        this.archivePath = archivePath

        this.status = 'PENDING';
        
        this.size = fs.statSync(archivePath)["size"];
    }
}

class FtpExporter{
    constructor(){
        this.ftp = new FtpClient.Client()
        this.sftp = new SftpClient()
        this.ftpQueue = []
        this.indexedTasks = {}
        this.lastUuid = 0
    }
    
    _getNextUuid(){
        this.lastUuid+=1
        return this.lastUuid
    }

    addFtpTask(task){
        this.ftpQueue.prepend(task);
        task.uuid = this._getNextUuid();
        this.indexedTasks[uuid] = task;
    }

    _send(){
        while(this.ftpQueue){

        }
    }
}

//////////////////////////////////////////////////////////////////////
////////////////////////////// Functions /////////////////////////////
//////////////////////////////////////////////////////////////////////


let lastUuid = 0;
const getNextUuid = function() {
    lastUuid = lastUuid + 1;
    return lastUuid;
}

let awaitingTrackingFtp = [];
const sendArchiveFtp  = function(archivePath, archiveName){
    if (ftp.closed) {
        return ftp.access({
            host : ftpConnectionOption.host,
            user : ftpConnectionOption.username,
            password : ftpConnectionOption.password,
            secure : ftpConnectionOption.protocol==="ftps" 
        }).then(()=>{
            // Manage tracking
            let uuid = getNextUuid();
            exportProcesses[uuid] = {
                fileName : archiveName,
                fileSize : fs.statSync(archivePath),
                progress : 0
            }
            ftp.trackProgress(info=>{
                exportProcesses[uuid].progress = info.bytesOverall
                //Check if transfer is completed
                if(exportProcesses[uuid].fileSize >=  info.bytesOverall){
                    if(awaitingTrackingFtp.length>0){
                        //If theres an other file awaiting to be send begin its tracking
                        ftp.trackProgress(awaitingTrackingFtp.pop())
                    }else{
                        //Else close the connection
                        ftp.trackProgress()
                        ftp.close() 
                    }
                }
            });
            ftp.uploadFrom(archivePath, ftpConnectionOption.targetFolder + archiveName)
        })
        .catch(error=>{
            ftp.close()
            throw error
        })
    }else{
        // Manage tracking
        let uuid = getNextUuid();
        exportProcesses[uuid] = {
            fileName : archiveName,
            fileSize : fs.statSync(archivePath),
            progress : 0
        }            
        awaitingTrackingFtp.unshift(info=>{
            exportProcesses[uuid].progress = info.bytesOverall
            //Check if transfer is completed
            if(exportProcesses[uuid].fileSize >=  info.bytesOverall){
                if(awaitingTrackingFtp.length>0){
                    //If theres an other file awaiting to be send begin its tracking
                    ftp.trackProgress(awaitingTrackingFtp.pop())
                }else{
                    //Else close the connection
                    ftp.trackProgress()
                    ftp.close() 
                }
            }
        })
        return ftp.uploadFrom(archivePath, ftpConnectionOption.targetFolder + archiveName).catch(error=>{
            ftp.close()
            throw error
        })
    }
    
    
}

const sendArchiveSftp  =  function(archivePath, archiveName){
    // Create the options depending of authentification mode
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


    
    //Creating the sftp connection
    let uuid = getNextUuid();
    exportProcesses[uuid] = {
        fileName : archiveName,
        fileSize : fs.statSync(archivePath),
        progress : 0
    }


    return sftp.connect(connectioOptions).then(async ()=>{
        sftp.fastPut(archivePath,ftpConnectionOption.targetFolder+archiveName,{
            step: (total_transferred, chunk, total)=>{
                exportProcesses[uuid].progress = total_transferred;
            }
        })
    }).then(()=>sftp.close())
    .catch(error=>{
        sftp.close()
        throw error
    })
}

//////////////////////////////////////////////////////////////////////
////////////////////////////// Controllers ///////////////////////////
//////////////////////////////////////////////////////////////////////

const exportFtp = async function(req, res){
    
    let studies = req.body.Resources

    // Creating and getting the archive
    let archivePath = await orthancInstance.getArchiveDicom(studies)
    let splitedPath =  archivePath.split('/')
    let archiveName = splitedPath[splitedPath.length -1]

    //Check for the protocol
    if (!['sftp', 'ftp', 'ftps'].includes(ftpConnectionOption.protocol)) {
        error  = 'unknown protocol for ftp export'
        console.error(error)
        res.status(500).send(error)
        return;
    }

    //Send the archive
    await (ftpConnectionOption.protocol === "sftp"?
        sendArchiveSftp(archivePath,archiveName):
        sendArchiveFtp(archivePath,archiveName)
    ).then(()=>{
        res.json(true)
    }).catch(error=>{
        console.error(error)
        res.status(500).send(error)
    })
}


const exportWebDav = async function(req, res){
    let studies = req.body.Resources

    //Creating and getting the archive
    let archivePath = await orthancInstance.getArchiveDicom(studies)
    let splitedPath =  archivePath.split('/')
    let archiveName = splitedPath[splitedPath.length -1]
    
    const client = createClient(
        webdavConnectionOption.host,
        {
            username: webdavConnectionOption.username,
            password: webdavConnectionOption.password,
            digest: webdavConnectionOption.digest
        })

    let uuid = getNextUuid();
    exportProcesses[uuid] = {
        fileName : archiveName,
        fileSize : fs.statSync(archivePath),
        progress : 0
    }

    let rs = fs.createReadStream(archivePath,{autoClose:true})
    rs.on('data', (chunk)=>{
        exportProcesses[uuid].progress += chunk.length;
        console.log(exportProcesses[uuid].progress);
    })
    rs.pipe(client.createWriteStream(webdavConnectionOption.targetFolder+archiveName))

    res.json(true)
}


module.exports = {exportFtp, exportWebDav}