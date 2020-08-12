class ADClient {
    
    constructor(type, protocole,  adresse, port, DN, mdp) {
        this.type = type,
        this.protocole = protocole
        this.adresse = adresse,
        this.port = port,
        this.DN = DN,
        this.mdp = mdp
    }

    async testSettings() {
        
        return true
    }

    async getAllCorrespodences() {
        return [
            { value: 'ad', label: 'Active Directory' },
            { value: 'ldap', label: 'LDAP' }
          ]
    }
}

module.exports = ADClient