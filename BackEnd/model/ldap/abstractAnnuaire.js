class AbstractAnnuaire {
    
    constructor() {
    }

    getAllLdapGroups = () => {
        throw 'abstract class, do not implement it'
    }

    authenticateLdapServer = () => {
        throw 'abstract class, do not implement it'
        //Renvois Vraie si une connexion à pu etre établie avec l'annuaire
    }

    authenticateUser = (username, password) => {
        throw 'abstract class, do not implement it'
        //Renvois Vraie si une connexion à pu etre établie avec l'annuaire
    }

    getAllLdapGroups = () => {
        throw 'abstract class, do not implement it'
        //Renvois tous les groupes de l'annuaire (peut etre modulé par un filtre)
    }    

    getPermission(username, groupes) {
        throw 'abstract class, do not implement it'
        //Prend un tableau de string representant les groupes (tous les groupes ayant une correspondance). Verifiepour chaque groupe que
        //l'utlisateur representé par username appartient à au groupe. Si l'utilisateur appartient à un groupe alors ajoute le groupe
        // à un tableau qui sera renvoyer
        
        //return un tableau de string representant tout les groupes auquel appartient l'utilisateur 
    }    
    
}

module.exports = AbstractAnnuaire;