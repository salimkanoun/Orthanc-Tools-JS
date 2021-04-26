const SftpClient = require("ssh2-sftp-client")

async function sendOverSftp(job,done){
  let endpoint = job.data.endpoint;
  let file = job.data.file;

  const sftp = new SftpClient();

  //Creating the sftp connection
  await sftp.connect(endpoint).then(()=>{
      //Starting the transfer
      sftp.fastPut(file.path,path.join(endpoint.targetFolder, file.name),{
          step:  (total_transferred, _chunk, _total)=>{
              job.progress(total_transferred/file.size*100);
          }
      }).then(()=>sftp.end())
  })
  done()
}

module.exports = {sendOverSftp}