const db = require("../database/models");

class Certificate {
    static createCertificate(label) {
        return db.Certificate.create({
            label
        });
    }


    static updateCertificate(id, label, path) {
        return db.Certificate.findOne({where: {id: id}}).then(async (certificate) => {
            certificate.label = label || certificate.label;
            certificate.path = path || certificate.path;
            await certificate.save();
        });
    }

    static getFromId(id) {
        return db.Certificate.findOne({where: {id: id}});
    }

    static getAllCertificates() {
        return db.Certificate.findAll();
    }

    static deleteCertificate(id) {
        return db.Certificate.destroy({where: {id}});
    }
}

module.exports = Certificate