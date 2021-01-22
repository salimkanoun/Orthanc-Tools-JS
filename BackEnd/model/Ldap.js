const db = require('../database/models')
const AdClient = require('../ldap/adClient')

const Ldap = {

    getLdapSettings: async () => {
        const option = await db.LdapOptions.findOne(({
            where: { id: 1 }, attributes: ['TypeGroupe',
                'protocole',
                'adresse',
                'port',
                'DN',
                'mdp', 'user', 'groupe', 'base']
        }))
        return ({ user: option.user, groupe: option.groupe, base: option.base, protocoles: option.protocole, TypeGroupe: option.TypeGroupe, adresse: option.adresse, port: option.port, DN: option.DN, mdp: option.mdp })
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
                protocole: options.protocole,
                groupe: options.groupe,
                user: options.user,
                base: options.base
            })
        } catch (error) {
            console.error(error)
        }
    },

    testLdapSettings: async (callback) => {
        try {
            const option = await db.LdapOptions.findOne(({
                where: { id: 1 }, attributes: ['TypeGroupe',
                    'protocole',
                    'adresse',
                    'port',
                    'DN',
                    'mdp', 'user', 'groupe', 'base']
            }))

            let client;

            if (option.TypeGroupe === 'ad') {
                client = new AdClient(option.TypeGroupe, option.protocole, option.adresse, option.port, option.DN, option.mdp, option.base, option.user, option.groupe)
            } else if (option.TypeGroupe === 'ldap') {
                //ToDo
                throw 'ToDo'
            } else {
                throw 'inccorect TypeGroupe'
            }

            return await client.testSettings(function (response) {
                return callback(response)
            })
        } catch (err) {
            console.log(err)
            return callback(false)
        }
    },

    getAllCorrespodences: async () => {
        const answer = await db.DistantUser.findAll(({ attributes: ['groupName', 'roleDistant'] }))
        let res = []
        for (let i = 0; i < answer.length; i++) {
            res[i] = { groupName: answer[i].dataValues.groupName, associedRole: answer[i].dataValues.roleDistant }
        }

        return res
    },

    setCorrespodence: async (match) => {
        try {
            const promise = db.DistantUser.create({
                groupName: match[0].groupName,
                roleDistant: match[0].associedRole,
            }).catch(e => { console.log(e); throw new Error('db create error') })

            return promise
        } catch (err) {
            console.log(err)
        }
    },

    deleteCorrespodence: async (match) => {
        try {
            await db.DistantUser.destroy({
                where: {
                    groupName: match.correspodence
                }
            })
        } catch (err) {
            console.log(err)
        }
    },

    getAllGroupeNames: async () => {

        const option = await db.LdapOptions.findOne(({
            where: { id: 1 }, attributes: ['TypeGroupe',
                'protocole',
                'adresse',
                'port',
                'DN',
                'mdp', 'user', 'groupe', 'base']
        }))

        let client;

        if (option.TypeGroupe === 'ad') {
            client = new AdClient(option.TypeGroupe, option.protocole, option.adresse, option.port, option.DN, option.mdp, option.base, option.user, option.groupe)
        } else if (option.TypeGroupe === 'ldap') {
            //ToDo
            throw 'ToDo'
        } else {
            throw 'inccorect TypeGroupe'
        }

        return new Promise((resove, reject) => {
            try {
                client.getAllCorrespodences(function (response) {
                    return resove(response)
                })
            } catch (error) {
                reject(error)
            }

        })

    },
}

module.exports = Ldap