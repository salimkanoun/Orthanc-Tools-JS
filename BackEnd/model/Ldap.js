const db = require('../database/models')
const LdapClient = require('../ldap/ldapClient')

const Ldap = {

     getLdapSettings: async() => {
        const option = await db.LdapOptions.findOne(({ where: { id: 1 }, attributes: ['TypeGroupe',
        'protocole',
        'adresse',
        'port',
        'DN',
        'mdp'] }))
        console.log("TEST MODEL get LDAP SETTINGS : ")
        console.log(option)
        return ({ protocoles: option.protocole, TypeGroupe: option.TypeGroupe, adresse: option.adresse, port: option.port, DN: option.DN, mdp: option.mdp })
    },

     setLdapSettings: async (options) => {
        console.log("TEST MODEL SET LDAP SETTINGS : ")
        console.log(options)
        try {
            await db.LdapOptions.upsert({
                id: 1,
                TypeGroupe: options.TypeGroupe,
                adresse: options.adresse,
                port: options.port,
                DN: options.DN,
                mdp: options.mdp,
                protocole: options.protocole
            })
          } catch (error) {
            console.log(error)
          }
    },

    testLdapSettings: async() => {
        const option = await db.LdapOptions.findOne(({ where: { id: 1 }, attributes: ['TypeGroupe',
        'protocole',
        'adresse',
        'port',
        'DN',
        'mdp'] }))
        client = new LdapClient(option.TypeGroupe, option.protocole, option.adresse, option.port, option.DN, option.mdp )
        return client.testSettings()
    }

}    

module.exports = Ldap