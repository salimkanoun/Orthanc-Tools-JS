const db = require("../database/models");
const {OTJSDBEntityNotFoundException} = require("../Exceptions/OTJSErrors");

class Certificate {
    static createCertificate(label) {
        return db.Certificate.create({
            label
        });
    }


    static updateCertificate(id, label, path) {
        return db.Certificate.findOne({where: {id: id}}).then(async (certificate) => {
            if (!certificate) throw new OTJSDBEntityNotFoundException();
            certificate.label = label || certificate.label;
            certificate.path = path || certificate.path;
            return certificate.save();
        });
    }

    static getFromId(id) {
        return db.Certificate.findOne({where: {id: id}});
    }

    static getAllCertificates() {
        return db.Certificate.findAll();
    }

    static async deleteCertificate(id) {
        if (!await this.getFromId(id)) throw new OTJSDBEntityNotFoundException();
        await db.Certificate.destroy({where: {id}});
    }
}

module.exports = Certificate