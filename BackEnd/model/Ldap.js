const db = require('../database/models')
const AdClient = require('../ldap/adClient')

const Ldap = {

     getLdapSettings: async() => {
        const option = await db.LdapOptions.findOne(({ where: { id: 1 }, attributes: ['TypeGroupe',
        'protocole',
        'adresse',
        'port',
        'DN',
        'mdp'] }))
        return ({ protocoles: option.protocole, TypeGroupe: option.TypeGroupe, adresse: option.adresse, port: option.port, DN: option.DN, mdp: option.mdp })
    },

     setLdapSettings: async (options) => {
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

        let client;

        if(option.TypeGroupe === 'ad') {
            client = new AdClient(option.TypeGroupe, option.protocole, option.adresse, option.port, option.DN, option.mdp )
        } else if(option.TypeGroupe === 'ldap') {
            //ToDo
            throw 'ToDo'
        } else {
            throw 'inccorect TypeGroupe'
        }
        
        return client.testSettings()
    },

    getAllCorrespodences: async() => {
        const answer = await db.DistantUser.findAll(({attributes: ['groupName', 'roleDistant']}))
        let res = [] 
        for(let i=0; i<answer.length; i++){
            res[i]={groupName:answer[i].dataValues.groupName, associedRole:answer[i].dataValues.roleDistant}
        } 

        return res
    },

    setCorrespodence: async(correspondence) => {
        const promise = db.DistantUser.create({
            groupName: correspondence[0].groupName,
            roleDistant : correspondence[0].associedRole,
          }).catch(e => console.log(e))
    
        return promise
    },

    deleteCorrespodence: async(correspondence) => {
        await db.DistantUser.destroy({
            where: {
                groupName: correspondence.correspodence
             }
          })
    },

    getAllGroupeNames: async() => {

        const option = await db.LdapOptions.findOne(({ where: { id: 1 }, attributes: ['TypeGroupe',
        'protocole',
        'adresse',
        'port',
        'DN',
        'mdp'] }))

        let client;

        if(option.TypeGroupe === 'ad') {
            client = new AdClient(option.TypeGroupe, option.protocole, option.adresse, option.port, option.DN, option.mdp )
        } else if(option.TypeGroupe === 'ldap') {
            //ToDo
            throw 'ToDo'
        } else {
            throw 'inccorect TypeGroupe'
        }
        return client.getAllCorrespodences()
    }

}    

module.exports = Ldap