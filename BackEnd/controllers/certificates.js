const Certificate = require("../model/export/Certificate");

const newCertificate = async function(req, res){
    try {
        let cert = new Certificate(req.body)
        await cert.createCertificate()
        res.send(cert.getSendable());
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const allCertificates = async function(req, res){
    try {
        res.json((await Certificate.getAllCertificate()).map(x=>x.getSendable()));
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const updateCertificate = async function(req,res){
    try {
        let cert = await Certificate.getFromId(req.body.id);
        cert.set(res.body)
        res.send(cert.id)
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const uploadCertificate = async function(req,res){
    try {
        let cert = await Certificate.getFromId(req.params.id)
        await cert.setCertContent(req.body)
        res.send('Done')
    } catch(error){

        console.error(error)
        res.status(400).send(error)
    }
}

const removeCertificate = async function(req,res){
    try {
        let cert = await Certificate.getFromId(req.body.id)
        await cert.deleteCertificate()
        res.send('Done')
    } catch(error){

        console.error(error)
        res.status(400).send(error)
    }
}

module.exports = {newCertificate, allCertificates, updateCertificate, uploadCertificate, removeCertificate}