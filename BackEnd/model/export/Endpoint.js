const SshKey = require('./SshKey');
const fs = require('fs');
const EndpointRepo = require('../../repository/Endpoint');
const {OTJSBadRequestException} = require('../../Exceptions/OTJSErrors');
const crypto = require('../../adapter/cryptoAdapter');


class Endpoint {
    constructor(params) {
        if (params.id != -1) {
            Endpoint._checkParams(params)
        }

        //Setting the variables that are commune between a manual call and a call with DB entity
        this.id = params.id || null
        this.label = params.label
        this.host = params.host
        this.targetFolder = params.targetFolder
        this.protocol = params.protocol
        this.port = params.port || null
        this.digest = params.digest || null
        this.ssl = params.ssl || null
        this.sshKey = params.sshKey || null

        //Setting the identifients
        if (this.id !== null) {
            if (params.pass) {
                let res = Endpoint._decryptIdentifiants(params.identifiants);
                this.username = res[0]
                this.password = res[1]
            } else {
                this.username = params.identifiants
                this.password = ''
            }
        } else {
            this.username = params.username
            this.password = params.password
        }
    }

    static _checkParams(params) {
        if (params.label === undefined || params.label === null || params.label === "")
            throw new OTJSBadRequestException('Endpoint : Invalid label')
        if (params.host === undefined || params.host === null || params.host === "")
            throw new OTJSBadRequestException('Endpoint : Invalid host')
        if (params.protocol === undefined || params.protocol === null || !['ftp', 'sftp', 'ftps', 'webdav'].includes(params.protocol))
            throw new OTJSBadRequestException('Endpoint : Invalid protocol')
    }

    async set(params) {
        this.id = params.id || this.id
        this.label = params.label || this.label
        this.host = params.host || this.host
        this.targetFolder = params.targetFolder || this.targetFolder
        this.protocol = params.protocol || this.protocol
        this.port = params.port || this.port
        this.digest = params.digest || this.digest
        this.sshKey = params.sshKey || this.sshKey
        this.ssl = params.ssl || this.ssl
        if (this.id) {
            await Endpoint.saveEndpoint(this);
        }
    }

    async getSshKey() {
        return await SshKey.getFromId(this.sshKey);
    }

    async createEndpoint() {
        this.id = await Endpoint.saveEndpoint(this)
        return this.id

    }

    static async saveEndpoint(endpoint) {
        let fields = {
            ...endpoint
        }
        fields.password = undefined
        fields.username = undefined
        fields.pass = !!endpoint.password
        if (!endpoint.password) {
            fields.identifiants = endpoint.username
        } else {
            fields.identifiants = Endpoint._encryptIdentifiants(endpoint.username, endpoint.password)
        }
        try {
            await EndpointRepo.saveEndpoint(fields.id || null, fields.label, fields.host, fields.targetFolder, fields.protocol, fields.port, fields.identifiants, fields.pass, fields.digest, fields.sshKey, fields.ssl)
            return endpoint.id
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    static getFromId(id) {
        return EndpointRepo.getFromId(id).then(entity => new Endpoint(entity));
    }

    static getAllEndpoints() {
        return EndpointRepo.getAllEndpoints()
            .then(entities => entities.map(e => new Endpoint(e)));
    }

    async removeEndpoint() {
        await EndpointRepo.removeEndpoint(this.id);
    }

    static async removeEndpoint(id) {
        await EndpointRepo.removeEndpoint(id);
    }

    ftpOptionFormat() {
        return {
            host: this.host,
            user: this.username,
            password: this.password,
            secure: this.ssl,
            port: this.port,
            targetFolder: this.targetFolder
        }
    }

    async sftpOptionFormat() {

        if (this.sshKey) {
            let keyObject = await this.getSshKey();
            if (keyObject.path === null) throw "The endpoint has no key file yet is tag with a sshKey"
            return {
                host: this.host,
                username: this.username,
                port: this.port,
                targetFolder: this.targetFolder,
                privateKey: fs.readFileSync(keyObject.path).toString(),
                passphrase: keyObject.pass || null
            }
        } else {
            return {
                host: this.host,
                username: this.username,
                password: this.password,
                port: this.port,
                path: this.targetFolder
            }
        }
    }

    webdavOptionFormat() {
        let host = this.host;
        if (!(this.host.startsWith("https://") || this.host.startsWith("http://")))
            host = (this.port === 43 ? "https://" : "http://") + this.host;
        const url = new URL(host);
        url.port = this.port;
        return {
            url,
            username: this.username,
            password: this.password,
            digest: this.digest,
            targetFolder: this.targetFolder
        }
    }

    static _encryptIdentifiants(username, password) {
        username = Buffer.from(username, 'utf8').toString('hex')
        password = Buffer.from(password, 'utf8').toString('hex')
        return crypto.encryptText(username + ':' + password)
    }

    static _decryptIdentifiants(ids) {
        let usernamePassword = crypto.decryptText(ids).split(':')
        let username = decodeURIComponent(usernamePassword[0].replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'))
        let password = decodeURIComponent(usernamePassword[1].replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'))
        return [username, password]
    }

    toJSON() {
        return {
            id: this.id,
            label: this.label,
            host: this.host,
            targetFolder: this.targetFolder,
            protocol: this.protocol,
            username: this.username,
            port: this.port,
            digest: this.digest,
            sshKey: this.sshKey,
            ssl: this.ssl
        }
    }


}

module.exports = Endpoint;