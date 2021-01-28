const db = require("../../database/models");
const fs = require('fs')
const { randomInt } = require("crypto");

class Certificate{
    constructor(params){
        this.id = params.id || null
        this.label = params.label
        this.path = params.path || null
    }

    async createCertificate(){
        this.id = await Certificate.createCertificate(this)
        return this.id;
    }

    static async createCertificate(cert){
        try {
            let certificate = await db.Certificate.create(cert)
            return certificate.id
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async set(params){
        this.id = params.id || this.id
        this.label = params.label || this.label
        this.path = params.path || this.path

        this.id = await db.Certificate.upsert(this)
        return this.id;
    }

    static async getFromId(id){
        return new Certificate(await db.Certificate.findOne({where:{id:id}}))
    }

    static async getAllCertificate(){
        let certificates = await db.Certificate.findAll().catch((error) => {throw error})
        return certificates.map(x=>new Certificate(x))
    }

    async deleteCertificate(){
        if(this.path&&fs.existsSync(this.path)){
            fs.unlinkSync(this.path)
        }
        await db.Certificate.destroy({where:{
            id:this.id
        }})
    }

    async setCertContent(chunk){
        let path
        do{
            path = 'data/certificates/cert-'+randomInt(99999)+'.cert';
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

    getSendable(){
        return {
            id: this.id,
            label: this.label,
            uploaded: !!this.path
        }
    }
}

module.exports = Certificate