const db = require('../database/models')
const AdClient = require('./ldap/adClient')

const Ldap = {

    getLdapSettings: async () => {
        return db.LdapOptions.findOne({
            where: { id: 1 }})
    },

    setLdapSettings: async (typeGroup, address, port, DN, password, protocol, group, user, base) => {

        const option = await db.LdapOptions.findOne((
            { where: { id: 1 } }
        ))

        option.TypeGroup = typeGroup
        option.address = address
        option.port = port
        option.DN = DN
        option.password = password
        option.protocol = protocol
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

        if (option.TypeGroup === 'ad') {
            client = new AdClient(option.TypeGroup, option.protocol, option.address, option.port, option.DN, option.password, option.base, option.user, option.group)
        } else if (option.TypeGroup === 'ldap') {
            //ToDo
            throw 'ToDo'
        } else {
            throw 'inccorect TypeGroup'
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

        if (option.TypeGroup === 'ad') {
            client = new AdClient(option.TypeGroup, option.protocol, option.address, option.port, option.DN, option.password, option.base, option.user, option.group)
        } else if (option.TypeGroup === 'ldap') {
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