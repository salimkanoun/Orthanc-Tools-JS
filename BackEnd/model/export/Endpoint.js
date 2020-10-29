const crypto = require('crypto')
const db = require('../../database/models')
const convert = require('../../utils/convert')
const SshKey = require('./SshKey')
const algo = 'aes256'

class Endpoint{
    constructor (params){
        Endpoint._checkParams(params)

        //Setting the variables that are commune between a manual call and a call with DB entity
        this.id = params.id || null
        this.label = params.label
        this.host = params.host
        this.targetFolder = params.targetFolder
        this.protocol = params.protocol
        this.port = params.port || null
        this.digest = params.digest || null
        this.sshKey = params.sshKey || null
        this.ssl = params.ssl || null

        //Setting the identifients
        if(this.id!==null){
            if(params.pass){
                let res = Endpoint._decryptIdentifiants(params.identifiants);
                this.username = res[0]
                this.password = res[1]
            }else{
                this.username = params.identifiants
                this.password = ''
            }
        }else{
            this.username = params.username
            this.password = params.password
        }
    }

    static _checkParams(params){
        if(params.label===undefined || params.label===null || params.label==="")
            throw('Endpoint : Invalid label')
        if(params.host===undefined || params.host===null || params.host==="")
            throw('Endpoint : Invalid host')
        if(params.protocol===undefined || params.protocol===null || !['ftp','sftp','ftps','webdav'].includes(params.protocol))
            throw('Endpoint : Invalid host')
        
    }

    async set(params){
        this.id = params.id || this.id
        this.label = params.label || this.label
        this.host = params.host || this.host
        this.targetFolder = params.targetFolder || this.targetFolder
        this.protocol = params.protocol || this.protocol
        this.port = params.port || this.protocol
        this.digest = params.digest || this.digest
        this.sshKey = params.sshKey || this.sshKey
        this.ssl = params.ssl || this.ssl
        if(this.id){
            let fields = {
                ...this
            }
            fields.password = undefined;
            fields.username = undefined;
    
            if(!server.password){
                fields.identifiant = server.username
            }else{
                fields.identifiant = Endpoint._encryptIdentifiants(server.username, server.password)
            }
            try {
                await db.Endpoint.upsert(fields)
            } catch (error) {
                console.error(error)
            }
        }
    }

    async createEndpoint(){
        this.id = await Endpoint.createEndpoint(this)
        return this.id

    }

    static async createEndpoint(server){
        let fields = {
            ...server
        }
        fields.password = undefined
        fields.username = undefined
        fields.pass = !!server.password
        if(!server.password){
            fields.identifiants = server.username
        }else{
            fields.identifiants = Endpoint._encryptIdentifiants(server.username, server.password)
        }
        try {
            let endpoint = await db.Endpoint.create(fields).then((endpoint)=>{
                if(server.sshKey){
                    endpoint.set('sshKey',server.sshKey)
                    endpoint.save()
                }
                return endpoint;
            })
            return endpoint.id
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    static async getFromId(id){
        return new Endpoint((await db.Endpoint.findAll({where:{
            id:id
        }}))[0])
    }

    static async getAllEndpoints (){
        try {
            let servers = [] 
            await db.Endpoint.findAll(
                {attributes: ['id', 'label', 'host', 'protocol', 'port', 'identifiants', 'pass', 'targetFolder', 'digest', 'ssl', 'sshKey']}
            ).then((results)=>{
                results.forEach(element => {
                    servers.push(new Endpoint(element.dataValues))
                });
            })
            return servers
        } catch (error) {
            console.error(error)
        }
    }

    async removeEndpoint(){
        await db.Endpoint.destroy({where:{id:this.id}})
    }

    static async removeEndpoint(id){
        await db.Endpoint.destroy({where:{id:id}})
    }


    static _encryptIdentifiants(username, password){
        username = Buffer.from(username, 'utf8').toString('hex')
        password = Buffer.from(password, 'utf8').toString('hex')
        let iv = new Int8Array(16)
        crypto.randomFillSync(iv)
        let cypher = crypto.createCipheriv(algo,process.env.HASH_KEY,iv)
        let identifiant = cypher.update(username+':'+password,"utf8","hex")+ cypher.final('hex');
        return convert.toHexString(iv)+':'+identifiant
    }

    static _decryptIdentifiants(ids){
        ids = ids.split(':')
        let iv = convert.toByteArray(ids[0])
        let decypher = crypto.createDecipheriv(algo,process.env.HASH_KEY,iv)
        let usernamePassword = (decypher.update(ids[1],"hex","utf8") + decypher.final('utf8')).split(':');
        let username = decodeURIComponent(usernamePassword[0].replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'))
        let password = decodeURIComponent(usernamePassword[1].replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'))
        return [username, password]
    }
    
    async getSendable(){
        let sshKey = (this.sshKey!==null?(await SshKey.getFromId(this.sshKey)).getSendable():null)
        return {
            id:this.id,
            label:this.label,
            host:this.host,
            targetFolder: this.targetFolder,
            protocol: this.protocol,
            username: this.username,
            port: this.port,
            digest: this.digest,
            sshKey:sshKey ,
            ssl: this.ssl
        }
    }
}

module.exports = Endpoint;