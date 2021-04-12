const db = require("../database/models");

class SshKey {
    static saveKey(id, label, path, pass){
        if (!id) return db.SshKey.create({label, path, pass});
        else return SshKey.getFromId(id).then((model)=>{
            model.path = path || model.path;
            model.path = label || model.label;
            model.pass = pass || model.pass;
            model.save();
            return model;
        })
    }

    static getFromId(id){
        return db.SshKey.findOne({where:{id:id}});
    }

    static  getAll(){
        return db.SshKey.findAll();
    }

    static delete(id){
        return db.SshKey.destroy({where:{id}});
    }
}

module.exports = SshKey;