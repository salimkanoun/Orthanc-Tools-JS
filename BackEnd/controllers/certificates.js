const { OTJSForbiddenException } = require("../Exceptions/OTJSErrors");
const Certificate = require("../model/export/Certificate");

const newCertificate = async function(req, res){
    let cert = await Certificate.createCertificate(req.body.label)
    res.send(cert.id.toString());
}

const allCertificates = async function(req, res){
    let certificates = await Certificate.getAllCertificates()
    res.send(certificates)
}

const uploadCertificate = async function(req,res){
    let certificate = await Certificate.getFromId(req.params.id)
    if( certificate.path ){
        throw OTJSForbiddenException('Certificate already existing, delete first')
    }
    let path = Certificate.setCertContent(req.body)
    Certificate.updateCertificate(certificate.id, certificate.label,path);
    res.sendStatus(201)
}

const removeCertificate = async function(req,res){
    await Certificate.deleteCertificate(req.params.id)
    res.sendStatus(200)
}

module.exports = {newCertificate, allCertificates, updateCertificate, uploadCertificate, removeCertificate}