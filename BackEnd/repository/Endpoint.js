const db = require('../database/models')

class Endpoint {
    static saveEndpoint(id, label, host, targetFolder, protocol, port, identifiants, pass, digest, sshKey, ssl){
        if (!id) return db.Endpoint.create({label, host, targetFolder, protocol, port, identifiants, pass, digest, sshKey, ssl});
        else return Endpoint.getFromId(id).then((model)=>{
            model.id = id || model.id
            model.label = label || model.label
            model.host = host || model.host
            model.targetFolder = targetFolder || model.targetFolder
            model.protocol = protocol || model.protocol
            model.port = port || model.protocol
            model.digest = digest || model.digest
            model.identifiants = digest || model.identifiants
            model.pass = pass || model.pass
            model.sshKey = sshKey || model.sshKey
            model.ssl = ssl || model.ssl
            model.save();
            return model;
        })
    }

    static getFromId(id){
        return db.Endpoint.findOne({where:{id}});
    }

    static getAllEndpoints(){
        return db.Endpoint.findAll();
    }

    static removeEndpoint(id){
        return db.Endpoint.destroy({where:{id}});
    }
}

module.exports = Endpoint;