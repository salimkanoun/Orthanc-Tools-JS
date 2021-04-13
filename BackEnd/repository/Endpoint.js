const db = require('../database/models')
const {OTJSDBEntityNotFoundException} = require("../Exceptions/OTJSErrors");

class Endpoint {
    static saveEndpoint(id, label, host, targetFolder, protocol, port, identifiants, pass, digest, sshKey, ssl) {
        if (!id) return db.Endpoint.create({
            label,
            host,
            targetFolder,
            protocol,
            port,
            identifiants,
            pass,
            digest,
            sshKey,
            ssl
        }).catch((e) => {
            if (e instanceof db.Sequelize.ForeignKeyConstraintError) throw new OTJSDBEntityNotFoundException();
            else throw e;
        });
        else return Endpoint.getFromId(id).then(async (model) => {
            if (!model) throw new OTJSDBEntityNotFoundException();
            model.id = id || model.id
            model.label = label || model.label
            model.host = host || model.host
            model.targetFolder = targetFolder || model.targetFolder
            model.protocol = protocol || model.protocol
            model.port = port || model.port
            model.digest = (digest != null ? digest : model.digest)
            model.identifiants = identifiants || model.identifiants
            model.pass = (pass != null ? pass : model.pass)
            model.sshKey = sshKey
            model.ssl = (ssl != null ? ssl : model.ssl)
            await model.save();
            return model;
        }).catch((e) => {
            if (e instanceof db.Sequelize.ForeignKeyConstraintError) throw new OTJSDBEntityNotFoundException();
            else throw e;
        });
    }

    static getFromId(id) {
        return db.Endpoint.findOne({where: {id}});
    }

    static getAllEndpoints() {
        return db.Endpoint.findAll();
    }

    static async removeEndpoint(id) {
        if (!await this.getFromId(id)) throw new OTJSDBEntityNotFoundException();
        await db.Endpoint.destroy({where: {id}});
    }
}

module.exports = Endpoint;