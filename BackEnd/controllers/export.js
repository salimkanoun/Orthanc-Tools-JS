const Orthanc = require("../model/Orthanc")
const FtpClient = require("basic-ftp")
const SftpClient = require("ssh2-sftp-client")
const {createClient} = require("webdav")
const path = require("path")
const fs = require("fs")
const { error } = require("console")
const tls = require('tls')

// Declaration of clients
let ftp = new FtpClient.Client()
let sftp = new SftpClient()
let orthancInstance = new Orthanc()

const origCreateSecureContext = tls.createSecureContext;

tls.createSecureContext = options => {
  const context = origCreateSecureContext(options);

  const pem = fs
    .readFileSync(path.join(__dirname, '..', 'data', 'certificates', 'rootCA.crt'), { encoding: "ascii" })
    .replace(/\r\n/g, "\n");

  const certs = pem.match(/-----BEGIN CERTIFICATE-----\n[\s\S]+?\n-----END CERTIFICATE-----/g);

  if (!certs) {
    throw new Error(`Could not parse certificate ./rootCA.crt`);
  }

  certs.forEach(cert => {
    context.context.addCACert(cert.trim());
  });

  return context;
};

const ftpConnectionOption = {
    host: 'localhost',
    port: '22',
    username: 'legrand',
    password: 'Dnmts!',
    targetFolder : '/home/legrand/test',
    protocol : 'sftp',
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


//TODO: 
// Code cleanup

const exportFtp = async function(req, res){
    
    let studies = req.body.Resources

    // Creating and getting the archive
    let archivePath = await orthancInstance.getArchiveDicom(studies)
    let splitedPath =  archivePath.split('/')
    let archiveName = splitedPath[splitedPath.length -1]

    //Checking used protocol
    if(ftpConnectionOption.protocol==='sftp'){
        //Creatingthe sftp connection
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
        sftp.connect(connectioOptions).then(async ()=>{
            await sftp.fastPut(archivePath,ftpConnectionOption.targetFolder+archiveName)
          }).then(()=>{
            res.json(true)
            ftp.close()
        }).catch(error=>{
            console.error(error)
            res.status(500).send(error)
            ftp.close()
        })
    }else if(['ftp', 'ftps'].includes(ftpConnectionOption.protocol)){
        // Creating ftp/ftps with the server  
        await ftp.access({
            host : ftpConnectionOption.host,
            user : ftpConnectionOption.username,
            password : ftpConnectionOption.password,
            secure : ftpConnectionOption.protocol==="ftps" 
        }).then(async()=>{
            // Uploading the archive to the server
            await ftp.uploadFrom(archivePath, ftpConnectionOption.targetFolder + archiveName)
        }).then(()=>{
            res.json(true)
            ftp.close()
        }).catch(error=>{
            console.error(error)
            res.status(500).send(error)
            ftp.close()
        })
    }else{
        error  = 'unknown protocol for ftp export'
        console.error(error)
        res.status(500).send(error)
    }  
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

    fs.createReadStream(archivePath)
        .pipe(client.createWriteStream(webdavConnectionOption.targetFolder+archiveName))

    res.json(true)
}

module.exports = {exportFtp, exportWebDav}