const Certificate = require("../model/export/Certificate");

const newCertificate = async function (req, res) {
    let cert = await Certificate.createCertificate(req.body.label)
    res.send(cert.toString());
}

const allCertificates = async function (req, res) {
    let certificates = await Certificate.getAllCertificates()
    res.send(certificates)
}

const uploadCertificate = async function (req, res) {
    await Certificate.setCertContent(req.params.id,req.body);
    res.sendStatus(201)
}

const removeCertificate = async function (req, res) {
    await Certificate.deleteCertificate(req.params.id)
    res.sendStatus(200)
}

module.exports = {newCertificate, allCertificates, uploadCertificate, removeCertificate}