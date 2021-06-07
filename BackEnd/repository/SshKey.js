const db = require("../database/models");
const {OTJSDBEntityNotFoundException} = require("../Exceptions/OTJSErrors");

class SshKey {
    static saveKey(id, label, path, pass) {
        if (!id) return db.SshKey.create({label, path, pass});
        else return SshKey.getFromId(id).then((model) => {
            if (!model) throw new OTJSDBEntityNotFoundException;
            model.path = path || model.path;
            model.label = label || model.label;
            model.pass = pass || model.pass;
            model.save();
            return model;
        })
    }

    static getFromId(id) {
        return db.SshKey.findOne({where: {id: id}});
    }

    static getAll() {
        return db.SshKey.findAll();
    }

    static async delete(id) {
        if (!await this.getFromId(id)) throw new OTJSDBEntityNotFoundException();
        await db.Endpoint.destroy({where: {sshKey: id}});
        await db.SshKey.destroy({where: {id}});
    }
}

module.exports = SshKey;