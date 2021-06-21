const SftpClient = require("ssh2-sftp-client")
const path = require('path')

async function sendOverSftp(job, done) {
    let endpoint = job.data.endpoint;
    let file = job.data.file;

    const sftp = new SftpClient();

    //Creating the sftp connection
    await sftp.connect(endpoint).then(async () => {
        //Starting the transfer
        await sftp.fastPut(file.path, path.join(endpoint.targetFolder, file.name), {
            step: (total_transferred, _chunk, _total) => {
                job.progress(total_transferred / file.size * 100);
            }
        }).then(() => sftp.end())
    }).catch((err) => {
        console.error(err);
        done(err);
    })
    done();
}

module.exports = {sendOverSftp}