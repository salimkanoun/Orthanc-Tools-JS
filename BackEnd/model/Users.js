const crypto = require('../adapter/cryptoAdapter')
const {OTJSNotFoundException, OTJSBadRequestException} = require('../Exceptions/OTJSErrors')
const Ldap = require('./Ldap')
const Role = require('../repository/Role')
const User = require('../repository/User')
const Option = require('../repository/Option')
const DistantUser = require('../repository/DistantUser')

class Users {

    constructor(username) {

        this.username = username
        this.ldapUser = false

        //if contain @, called User is from LDAP
        if (this.username.indexOf('@') !== -1) {
            this.ldapUsername = this.username
            if (this.username.indexOf('@') === 0) {
                this.username = this.username.substr(1)
                this.ldapUsername = this.username
            } else {
                this.username = this.username.split('@')[0];
            }
            this.ldapUser = true
        }

    }

    _getUserEntity() {
        return User.getUser(this.username).then(entity => {
            if (!entity) {
                throw new OTJSNotFoundException('Not Found')
            } else {
                return entity
            }
        }).catch(error => {
            throw error
        })
    }

    isAdmin() {
        return this._getUserEntity().then(user => user.super_admin).catch((error) => {
            throw error
        })
    }

    checkLocalPassword(plainPassword) {
        return this._getUserEntity().then(user => {
            return crypto.compare(plainPassword, user.password)
        }).catch((error) => {
            throw error
        })
    }

    getAuthenticationMode() {
        return Option.getOneAuthenticationMode()
    }

    async checkPassword(plainPassword) {

        let option = await this.getAuthenticationMode()
        if (option.ldap && this.ldapUser) {
            //LDAP user
            return await Ldap.authenticateUser(this.ldapUsername, plainPassword).catch((error) => {
                throw error
            })
        } else {
            //Local user
            return await this.checkLocalPassword(plainPassword).catch((error) => {
                throw error
            })
        }


    }

    static async createUser(username, firstname, lastname, email, password, role, super_admin) {

        if (username.indexOf('@') !== -1) throw new OTJSBadRequestException('@ not allowed for local username definition')

        var hash = crypto.hash(password,16)
        
        return User.create(username, firstname, lastname, email, hash, role, super_admin)

    }

    static async deleteUser(username) {
        let user = new Users(username)

        if (await user.isAdmin()) {
            let superUserCount = await User.findAndCountAllSuperUser()
            if (superUserCount <= 1) throw 'Can\'t delete last super user'
        }

        await User.delete(username)

    }

    static async modifyUser(username, firstname, lastname, password, email, role, isSuperAdmin) {

        if (username.indexOf('@') !== -1) throw '@ is forbiden'

        let user = new Users(username)

        if (await user.isAdmin() && role !== 'admin') throw 'Can\'t modify superAdmin\'s role'

        const mod = await user._getUserEntity()
        mod.username = username
        mod.firstname = firstname
        mod.lastname = lastname
        mod.super_admin = isSuperAdmin
        mod.email = email

        if (password !== null) {
            try{
                mod.password = crypto.hash(password,16)
            }catch(error){
                throw error
            }
        }

        mod.role = role
        await mod.save()

    }

    static async getUsers() {
        let userEntities = await User.getAllUser()
        let usersAnswer = []
        userEntities.forEach((user) => {
            usersAnswer.push({
                id: user.id,
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                superAdmin: user.super_admin
            })
        })
        return usersAnswer
    }

    getLocalUserRight() { //add
        return this._getUserEntity().then(user => {
            return Role.getRole(user.role)
        })
    }

    async getLDAPUserRight() {

        //Get Ldap Group having a local role correspondance
        const ldapMatches = await DistantUser.getAllLocalRoleAndLdapGroup()

        //Flatten known LdapGroup in Array
        let knownLdapGroups = ldapMatches.map((match) => {
            return match.ldap_group
        })

        //Get user's group from LDAP
        let userLdapGroups = await Ldap.getGroupMembershipForUser(this.ldapUsername)

        let role = {
            import: false,
            content: false,
            anon: false,
            export_local: false,
            export_extern: false,
            query: false,
            auto_query: false,
            delete: false,
            modify: false,
            cd_burner: false,
            admin: false
        }

        //Loop user's group until we found a known group having a local role
        for (let i = 0; i < userLdapGroups.length; i++) {

            //Get and return the first match
            if (knownLdapGroups.includes(userLdapGroups[i].cn)) {

                let local_role = ldapMatches.filter((match) => {
                    return match.ldap_group === userLdapGroups[i].cn
                })

                //get Role data and return it to controller
                let currentRole = await Role.getRole(local_role[0].local_role)

                if (role.import === false) role.import = currentRole.import
                if (role.content === false) role.content = currentRole.content
                if (role.anon === false) role.anon = currentRole.anon
                if (role.export_local === false) role.export_local = currentRole.export_local
                if (role.export_extern === false) role.export_extern = currentRole.export_extern
                if (role.query === false) role.query = currentRole.query
                if (role.auto_query === false) role.auto_query = currentRole.auto_query
                if (role.delete === false) role.delete = currentRole.delete
                if (role.modify === false) role.modify = currentRole.modify
                if (role.cd_burner === false) role.cd_burner = currentRole.cd_burner
                if (role.admin === false) role.admin = currentRole.admin

            }

        }

        return role


    }

    getUserRight() {
        return this.getAuthenticationMode().then(async option => {
            if (option.ldap && this.ldapUser) {
                //LDAP user
                return await this.getLDAPUserRight()
            } else {
                //Local user
                return await this.getLocalUserRight()
            }

        }).catch(error => {
            throw error
        })

    }

}

module.exports = Users
