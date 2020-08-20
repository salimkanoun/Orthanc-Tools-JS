var AbstractAnnuaire = require ('./abstractAnnuaire');

class Ldap extends AbstractAnnuaire {
    
    constructor() {
        super()
        //ToDo
    }

    testSettings(callback) {
        //ToDo
    }

    getAllCorrespodences(callback) {
        //ToDo
    }    

    autentification(username, mdp, callback) {
        //ToDo
    }
    
    getPermission(username, groupes, callback) {
        //ToDo
    }    
    
}

module.exports = Ldap