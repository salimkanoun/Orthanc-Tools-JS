const DistantUser = require('../repository/DistantUser')
const LdapOption = require('../repository/LdapOption')
const AdClient = require('./ldap/adClient')

const Ldap = {

    getLdapSettings: () => {
        return LdapOption.getOneLdap()
    },

    getLdapClient: async () => {
        let ldapOptions = await Ldap.getLdapSettings()

        if (ldapOptions.TypeGroup === 'ad') {
            return new AdClient(ldapOptions.TypeGroup, ldapOptions.protocol, ldapOptions.address, ldapOptions.port, ldapOptions.DN, ldapOptions.password, ldapOptions.base, ldapOptions.user, ldapOptions.group)
        } else if (ldapOptions.TypeGroup === 'ldap') {
            //ToDo
            throw 'ToDo'
        } else {
            throw 'inccorect TypeGroup'
        }


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

        const client = await Ldap.getLdapClient()
        return client.authenticateLdapServer().catch( (error) => {throw error})

    },

    authenticateUser : async (username, password) => {
        const client = await Ldap.getLdapClient()
        return client.authenticateUser(username, password).catch( () => {return false})
    },

    getAllCorrespondences: async () => {
        const correspondances = await DistantUser.getAllLocalRoleAndLdapGroup()
        let results = []
        correspondances.forEach( (correspondance) => {
            results.push({ localRole: correspondance.local_role, ldapGroup: correspondance.ldap_group })
        });

        return results
    },

    setCorrespondence: async (ldapGroup, localRole) => {
        await DistantUser.create(ldapGroup,localRole)
    },

    deleteCorrespondence: (ldapGroup) => {
        return DistantUser.delete(ldapGroup)
    },

    getAllLdapGroups: async () => {
        const client = await Ldap.getLdapClient()
        let ldapGroups = await client.getAllLdapGroups().catch( (error)=> {throw error})
        return ldapGroups

    },

    isUserMemberOf: async (username, ldapGroup) => {
        let client = await Ldap.getLdapClient()
        let response = await client.isUserMemberOf(username, ldapGroup).catch( (error)=> {throw error})
        return response
    },

    getGroupMembershipForUser : async () => {
        let client = await Ldap.getLdapClient()
        return client.getGroupMembershipForUser(this.ldapUsername)
    }
}

module.exports = Ldap