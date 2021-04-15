//Modules
const Queue = require('../../adapter/bullAdapter');
const SftpClient = require("ssh2-sftp-client");
const FtpClient = require("basic-ftp");
const tls = require("tls");
const {createClient} = require("webdav");
const path = require('path');
const fs = require('fs');
const Certificate = require('./Certificate');

const ftp = new FtpClient.Client()

let instance

class Exporter {
    constructor() {
        //Singleton Logique
        if (instance) return instance;
        instance = this;

        //Declaration for the send queue
        this.sendQueue = new Queue('send', {
            'send-over-ftp': Exporter._sendOverFtp,
            'send-over-sftp': Exporter._sendOverSftp,
            'send-over-webdav': Exporter._sendOverWebdav
        });

        Certificate.getAllCertificates().then((certificates) => {
            let origCreateSecureContext = tls.createSecureContext
            tls.createSecureContext = options => {
                const context = origCreateSecureContext(options)
                try {
                    certificates.forEach((cert) => {
                        const pem = fs
                            .readFileSync(cert.path, {encoding: "ascii"})
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

    static async _sendOverFtp(job, done) {
        let endpoint = job.data.endpoint;
        let file = job.data.file;
        //Opening the ftp connecttion
        await ftp.access(endpoint).then(async () => {
            //Start tracking
            ftp.trackProgress(info => {
                job.progress(info.bytesOverall / file.size * 100)
            });
            //Start Uploading
            await ftp.uploadFrom(file.path, path.join(endpoint.targetFolder, file.name))
        })
        done()
    }

    static async _sendOverSftp(job, done) {
        let endpoint = job.data.endpoint;
        let file = job.data.file;

        const sftp = new SftpClient();

        //Creating the sftp connection
        await sftp.connect(endpoint).then(() => {
            //Starting the transfer
            sftp.fastPut(file.path, path.join(endpoint.targetFolder, file.name), {
                step: (total_transferred, _chunk, _total) => {
                    job.progress(total_transferred / file.size * 100);
                }
            }).then(() => sftp.end())
        })
        done()
    }

    static async _sendOverWebdav(job, done) {
        let endpoint = job.data.endpoint
        let file = job.data.file


        try {
            //Creating the conncetion
            const client = createClient(endpoint.url,
                {
                    username: endpoint.username,
                    password: endpoint.password,
                    digest: endpoint.digest
                })
            //Transfering archive
            let rs = fs.createReadStream(file.path, {autoClose: true})
            await new Promise((resolve, reject) => {
                //Monitoring the progress
                let sent = 0
                rs.on('data', (chunk) => {
                    sent += chunk.length
                    job.progress(sent / file.size * 100).catch((err => console.error(err)))

                })
                rs.on('end', () => {
                    resolve()
                })
                rs.on('error', reject)
                try {
                    let ws = client.createWriteStream(path.join(endpoint.targetFolder, file.name))
                    rs.pipe(ws)
                } catch (error) {
                    console.error(error)
                }
            })
        } catch (error) {
            console.error(error)
        }
        job.progress(100)
        done()
    }

    async uploadFile(taskId, endpoint, filePath) {
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
            path: filePath,
            name: path.basename(filePath),
            size: await fs.promises.stat(filePath).then(stats => stats.size)
        }
        await this.sendQueue.addJob(
            {taskId, endpoint: formatedEndpoint, file},
            {
                'ftp': 'send-over-ftp',
                'sftp': 'send-over-sftp',
                'webdav': 'send-over-webdav'
            }[endpoint.protocol])
        return taskId;
    }

    async getUploadJobs(taskId) {
        let jobs = await this.sendQueue.getJobs();
        return jobs.filter(job => job.data.taskId === taskId);
    }


}


module.exports = Exporter