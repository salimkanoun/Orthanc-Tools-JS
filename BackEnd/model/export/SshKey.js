const db = require("../../database/models");
const fs = require('fs');
const crypto = require('crypto')

class SshKey{
    constructor(params){
        this.id = params.id || null
        this.label = params.label
        this.path = params.path || null
        this.pass = params.pass || null
    }

    async createSshKey(){
        this.id = await SshKey.createSshKey(this)
        return this.id;
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

    static async createSshKey(key){
        try {
            let sshKey = await db.SshKey.create(key)
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

    async set(params){
        this.id = params.id || this.id
        this.label = params.label || this.label
        this.path = params.path || this.path
        this.pass = params.pass || this.pass

        console.log(params)
        console.log(this)

        this.id = (await db.SshKey.upsert(this)).id
        return this.id;
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
            uploaded: !!this.path
        }
    }

}

module.exports = SshKey