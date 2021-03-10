var ActiveDirectory = require('activedirectory2').promiseWrapper
var AbstractAnnuaire = require('./abstractAnnuaire')


class ADClient extends AbstractAnnuaire {

    constructor(type, protocol, address, port, DN, password, base, user, group) {
        super()
        this.type = type
        this.DN = DN
        this.password = password
        this.base = base
        this.user = user

        if (group === '') {
            this.group = 'CN=*'
        } else {
            this.group = group
        }

        let config = {
            url: (protocol + address + ':' + port),
            baseDN: this.base,
            username: this.DN,
            password: this.password
        }

        this.ad = new ActiveDirectory(config);

    }

    getAllLdapGroups = () => {
        let queryFindGroupsOptions = {
            scope: 'sub',
            filter: this.group
        }

        return this.ad.findGroups(queryFindGroupsOptions).catch( (error) =>  { throw error})
       
    }

    authenticateLdapServer = () => {
        return this.ad.authenticate(this.DN, this.password).catch((error)=> {
            throw error
        });
    }

    authenticateUser = (username, password) => {
        return this.ad.authenticate(username, password).catch((error)=> {
            throw error
        });
    }
 
    isUserMemberOf = (username, ldapGroup) => {
        return this.ad.isUserMemberOf(username, ldapGroup).catch( (error) => { throw error })

    }

    getGroupMembershipForUser = (username) => {
        return this.ad.getGroupMembershipForUser(username)
    }

}

module.exports = ADClient