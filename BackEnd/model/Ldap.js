const db = require('../database/models')
const { OTJSForbiddenException } = require('../Exceptions/OTJSErrors')
const AdClient = require('./ldap/adClient')

const Ldap = {

    getLdapSettings: () => {
        return db.LdapOptions.findOne({
            where: { id: 1 }})
    },

    getLdapClient : async () => {
        let ldapOptions = await Ldap.getLdapSettings()
        return new AdClient(ldapOptions.TypeGroup, ldapOptions.protocol, ldapOptions.address, ldapOptions.port, ldapOptions.DN, ldapOptions.password, ldapOptions.base, ldapOptions.user, ldapOptions.group)
    },

    setLdapSettings: async (typeGroup, address, port, DN, password, protocol, group, user, base) => {

        const option = await Ldap.getLdapSettings()

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

        const option = await Ldap.getLdapSettings()

        let client

        if (option.TypeGroup === 'ad') {
            client = await Ldap.getLdapClient()
        } else if (option.TypeGroup === 'ldap') {
            //ToDo
            throw 'ToDo'
        } else {
            throw 'inccorect TypeGroup'
        }

        return await client.testSettings().catch(error => { throw new OTJSForbiddenException(error.message) })

    },

    getAllCorrespodences: async () => {
        const answer = await db.DistantUser.findAll(({ attributes: ['groupName', 'roleDistant'] }))
        console.log(answer)
        let res = []
        for (let i = 0; i < answer.length; i++) {
            res[i] = { groupName: answer[i].dataValues.groupName, associedRole: answer[i].dataValues.roleDistant }
        }

        return res
    },

    setCorrespondence: async (ldapGroup, localRole) => {
        await db.DistantUser.create({
            groupName: ldapGroup,
            roleDistant: localRole,
        })

    },

    deleteCorrespodence: (ldapGroup) => {
        return db.DistantUser.destroy({
            where: {
                groupName: ldapGroup
            }
        })
    },

    getAllGroupeNames: async () => {

        const option = await Ldap.getLdapSettings()

        let client;

        if (option.TypeGroup === 'ad') {
            client = await Ldap.getLdapClient()
        } else if (option.TypeGroup === 'ldap') {
            //ToDo
            throw 'ToDo'
        } else {
            throw 'inccorect TypeGroup'
        }

        let correspondances = await client.getAllCorrespodences()

        return correspondances

    },
}

module.exports = Ldap