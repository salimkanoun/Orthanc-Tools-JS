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


//////////////////////////////////////////////////////////////////////
////////////////////////////// Instances /////////////////////////////
//////////////////////////////////////////////////////////////////////

const ftp = new FtpClient.Client()
const sftp = new SftpClient()
const orthancInstance = new Orthanc()

// tls hack to allow ca to be added 
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

//////////////////////////////////////////////////////////////////////
////////////////////////////// Functions /////////////////////////////
//////////////////////////////////////////////////////////////////////

const sendArchiveFtp  = function(archivePath, archiveName){
    return ftp.access({
        host : ftpConnectionOption.host,
        user : ftpConnectionOption.username,
        password : ftpConnectionOption.password,
        secure : ftpConnectionOption.protocol==="ftps" 
    }).then(async()=>{
        // Uploading the archive to the server
        await ftp.uploadFrom(archivePath, ftpConnectionOption.targetFolder + archiveName)
    }).then(()=>ftp.close())
    .catch(error=>{
        ftp.close()
        throw error
    })
}

const sendArchiveSftp  =  function(archivePath, archiveName){
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
    
    return sftp.connect(connectioOptions).then(async ()=>{
        await sftp.fastPut(archivePath,ftpConnectionOption.targetFolder+archiveName)
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

    fs.createReadStream(archivePath)
        .pipe(client.createWriteStream(webdavConnectionOption.targetFolder+archiveName))

    res.json(true)
}


module.exports = {exportFtp, exportWebDav}