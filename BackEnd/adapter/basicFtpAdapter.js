const FtpClient =  require("basic-ftp" )

async function sendOverFtp(job,done){
    let endpoint = job.data.endpoint;
    let file = job.data.file;

    const ftp = new FtpClient.Client()
    //Opening the ftp connection
    await ftp.access(endpoint).then(async()=>{
        //Start tracking
        ftp.trackProgress(info=>{
            job.progress(info.bytesOverall/file.size*100)
        });
        //Start Uploading
        await ftp.uploadFrom(file.path, path.join(endpoint.targetFolder,  file.name))
    })
    done()
}

module.exports = {sendOverFtp}