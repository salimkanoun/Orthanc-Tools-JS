const { OTJSForbiddenException } = require("../Exceptions/OTJSErrors");
const Certificate = require("../model/export/Certificate");

const newCertificate = async function(req, res){
    await Certificate.createCertificate(req.body.label)
    res.status(201)
}

const allCertificates = async function(req, res){
    let certificates = await Certificate.getAllCertificate()
    res.send(certificates)
}

//SK Pas utilisee ? 
const updateCertificate = async function(req,res){
    await Certificate.updateCertificate(req.params.id, req.body.label, req.body.path)
    res.status(200)
}

const uploadCertificate = async function(req,res){
    let certificate = await Certificate.getFromId(req.params.id)
    if( certificate.path ){
        throw OTJSForbiddenException('Certificate already existing, delete first')
    }
    cert.setCertContent(req.body)
    res.status(201)
}

const removeCertificate = async function(req,res){
    await cert.deleteCertificate(req.params.id)
    res.status(200)
}

module.exports = {newCertificate, allCertificates, updateCertificate, uploadCertificate, removeCertificate}