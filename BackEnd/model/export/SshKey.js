const db = require("../../database/models");
const fs = require('fs');
const crypto = require('crypto');
const convert = require("../../utils/convert");

const algo = 'aes256'

class SshKey{
    constructor(params){
        this.id = params.id || null
        this.label = params.label
        this.path = params.path || null
        this.pass = params.pass || null

        if(this.id!==null&&this.pass){
            let encryptedPass = this.pass.split(':')
            let iv = convert.toByteArray(encryptedPass[0])
            let decypher = crypto.createDecipheriv(algo,process.env.HASH_KEY,iv)
            let pass = decypher.update(encryptedPass[1],"hex","utf8") + decypher.final('utf8');
            this.pass = decodeURIComponent(pass.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'))
        }
    }

    async createSshKey(){
        
        this.id = await SshKey.createSshKey(this)
        return this.id;
    }

    static async createSshKey(key){
        try {
            let queryFields = {
                ...key
            }
            if(key.pass){
                let iv = new Int8Array(16)
                crypto.randomFillSync(iv)
                let cypher = crypto.createCipheriv(algo,process.env.HASH_KEY,iv)
                let pass = cypher.update(Buffer.from(key.pass, 'utf8').toString('hex'),"utf8","hex")+ cypher.final('hex');
                queryFields.pass = convert.toHexString(iv)+':'+pass
            }

            let sshKey = await db.SshKey.create(queryFields)
            return sshKey.id
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    static async getFromId(id){
        return new SshKey(await db.SshKey.findOne({where:{id:id}}))
    }

    static async getAllSshKey(){
        return await db.SshKey.findAll().map(x=>new SshKey(x));
    }

    async setKeyContent(chunk){
        
        let path
        do{
            path = 'data/private_key/key-'+crypto.randomInt(99999);
        }while(fs.existsSync(path))
        let stream = fs.createWriteStream(path,{
            autoClose:true
        });
        stream.write(chunk)

        if(fs.existsSync(this.path)){
            fs.unlinkSync(this.path)
        }

        this.set({path:path})
    }

    async set(params){
        this.id = params.id || this.id
        this.label = params.label || this.label
        this.path = params.path || this.path
        this.pass = params.pass || this.pass

        if(this.pass){
            let iv = new Int8Array(16)
            crypto.randomFillSync(iv)
            let cypher = crypto.createCipheriv(algo,process.env.HASH_KEY,iv)
            let pass = cypher.update(Buffer.from(this.pass, 'utf8').toString('hex'),"utf8","hex")+ cypher.final('hex');
            this.pass = convert.toHexString(iv)+':'+pass
        }

        await db.SshKey.upsert(this)
        return this.id
    }

    async deleteSshKey(){
        if(this.path&&fs.existsSync(this.path)){
            fs.unlinkSync(this.path)
        }
        await db.SshKey.destroy({where:{
            id:this.id
        }})
    }

    getSendable(){
        return {
            id: this.id,
            label: this.label,
            uploaded: !!this.path,
            pass: !!this.pass
        }
    }

}

module.exports = SshKey