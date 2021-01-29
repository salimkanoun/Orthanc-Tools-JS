const db = require("../../database/models")
const fs = require('fs')

class Certificate{
    constructor(params){
        this.id = params.id || null
        this.label = params.label
        this.path = params.path || null
    }

    static createCertificate(label){
        return db.Certificate.create({
            lablel : label
        }).catch((error) => {throw error})
    }

    static updateCertificate(id, label, path){
        let certificate = await Certificate.getFromId(id)
        certificate.label = label
        certificate.path = path
        await certificate.save()
    }

    static getFromId(id){
        return db.Certificate.findOne({where:{id:id}}.catch((error) => {throw error}))
    }

    static async getAllCertificate(){
        return await db.Certificate.findAll().catch((error) => {throw error})

    }

    //Sk ici eviter de bloker l'event loop
    static async deleteCertificate(id){
        let certificate = await Certificate.getFromId(id)
        if( certificate.path && fs.existsSync(certificate.path)){
            fs.unlinkSync(certificate.path)
        }
        await db.Certificate.destroy({where:{
            id : certificate.id
        }})
    }

    //SK ici eviter de bloquer l event loop
    //Passer en promise car ici en callback soit faire passer un callback 
    //Soit passer en prmomise
    //Pour declancher une errur si ecriture fail (mieux vaut utiliser fsPromise)
    static setCertContent(chunk){
        let path = 'data/certificates/cert-'+Date.now()+'.cert'
        let stream = fs.createWriteStream( path, {
            autoClose:true
        });
        stream.write(chunk)
    }

}

module.exports = Certificate