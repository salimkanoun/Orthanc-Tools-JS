//Modules
const Queue = require('../../adapter/bullAdapter');
const Sftp = require('../../adapter/ssh2SftpClientAdapter');
const Ftp = require('../../adapter/basicFtpAdapter');
const tls = require("tls");
const Webdav = require('../../adapter/webdavAdapter');
const path = require('path');
const fs = require('fs');
const Certificate = require('./Certificate');

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
        Ftp.sendOverFtp(job,done)
    }

    static async _sendOverSftp(job, done) {
        Sftp.sendOverSftp(job,done)
    }

    static async _sendOverWebdav(job, done) {
        Webdav.sendOverWebdav(job,done)
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