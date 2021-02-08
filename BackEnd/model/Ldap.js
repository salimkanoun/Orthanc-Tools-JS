const db = require('../database/models')
const AdClient = require('./ldap/adClient')

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
        return ({
            user: option.user,
            groupe: option.groupe,
            base: option.base,
            protocoles: option.protocole,
            TypeGroupe: option.TypeGroupe,
            adresse: option.adresse,
            port: option.port,
            DN: option.DN,
            mdp: option.mdp
        })
    },

    setLdapSettings: async (typeGroup, address, port, DN, password, protocol, group, user, base) => {

        const option = await db.LdapOptions.findOne((
            { where: { id: 1 } }
        ))

        option.TypeGroupe = typeGroup
        option.address = address
        option.port = port
        option.DN = DN
        option.mdp = password
        option.protocole = protocol
        option.group = group
        option.user = user
        option.base = base

        await option.save()

    },

    testLdapSettings: async () => {

        const option = await db.LdapOptions.findOne((
            {
                where: { id: 1 }
            }
        ))

        let client

        if (option.TypeGroupe === 'ad') {
            client = new AdClient(option.TypeGroupe, option.protocole, option.adresse, option.port, option.DN, option.mdp, option.base, option.user, option.groupe)
        } else if (option.TypeGroupe === 'ldap') {
            //ToDo
            throw 'ToDo'
        } else {
            throw 'inccorect TypeGroupe'
        }

        return await client.testSettings().catch(error => { return error })

    },

    getAllCorrespodences: async () => {
        const answer = await db.DistantUser.findAll(({ attributes: ['groupName', 'roleDistant'] }))
        let res = []
        for (let i = 0; i < answer.length; i++) {
            res[i] = { groupName: answer[i].dataValues.groupName, associedRole: answer[i].dataValues.roleDistant }
        }

        return res
    },

    setCorrespodence: async (groupName, associatedRole) => {
        await db.DistantUser.create({
            groupName: groupName,
            roleDistant: associatedRole,
        })

    },

    deleteCorrespodence: async (groupName) => {
        await db.DistantUser.destroy({
            where: {
                groupName: groupName
            }
        })
    },

    getAllGroupeNames: async () => {

        const option = await db.LdapOptions.findOne((
            {
                where: { id: 1 }
            }
        ))

        let client;

        if (option.TypeGroupe === 'ad') {
            client = new AdClient(option.TypeGroupe, option.protocole, option.adresse, option.port, option.DN, option.mdp, option.base, option.user, option.groupe)
        } else if (option.TypeGroupe === 'ldap') {
            //ToDo
            throw 'ToDo'
        } else {
            throw 'inccorect TypeGroupe'
        }

        let correspondances = await client.getAllCorrespodences()

        return correspondances

    },
}

module.exports = Ldap