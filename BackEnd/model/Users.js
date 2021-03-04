const bcrypt = require('bcryptjs')
const db = require('../database/models')
const ldap = require('./Ldap')
const { OTJSNotFoundException, OTJSBadRequestException } = require('../Exceptions/OTJSErrors')
const Ldap = require('./Ldap')

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
    console.log(this.username)
    return db.User.findOne({ where: { username: this.username } }).then(entity => {
      if (!entity) {
        throw new OTJSNotFoundException('Not Found')
      } else {
        return entity
      }
    }).catch(error => { throw error })
  }

  isAdmin() {
    return this._getUserEntity().then(user => user.super_admin).catch((error) => { throw error })
  }

  checkLocalPassword(plainPassword) {
    return this._getUserEntity().then(async user => {
      return await bcrypt.compare(plainPassword, user.password)
    }).catch((error) => { throw error })
  }

  getAuthenticationMode() {
    return db.Option.findOne({
      attributes: ['ldap'],
      where: { id: '1' }
    })
  }

  async checkPassword(plainPassword) {

    let option = await this.getAuthenticationMode()
    if (option.ldap && this.ldapUser) {
      //LDAP user
      return await Ldap.authenticateUser(this.ldapUsername, plainPassword).catch((error) => { throw error })
    } else {
      //Local user
      return await this.checkLocalPassword(plainPassword).catch((error) => { throw error })
    }


  }

  static async createUser(username, firstname, lastname, email, password, role, super_admin) {

    if (username.indexOf('@') !== -1) throw new OTJSBadRequestException('@ not allowed for local username definition')

    const saltRounds = 10
    return bcrypt.hash(password, saltRounds).then(function (hash) {
      db.User.create({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hash,
        role: role,
        super_admin: super_admin
      }
      ).catch(e => { throw e })

    })
  }

  static async deleteUser(username) {
    let user = new Users(username)

    if (await user.isAdmin()) {
      let superUserCount = await db.User.findAndCountAll({ where: { super_admin: true } })
      if (superUserCount <= 1) throw 'Can\'t delete last super user'
    }

    await db.User.destroy({
      where: {
        username: username
      }
    })

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
      mod.password = await bcrypt.hash(password, 10).catch((error) => {
        throw error
      })
    }

    mod.role = role
    await mod.save()

  }

  static async getUsers() {
    let userEntities = await db.User.findAll()
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

  getLocalUserRight() {
    return this._getUserEntity().then(user => {
      return db.Role.findOne({
        where: { name: user.role }
      })
    })
  }

  async getLDAPUserRight() {

    //Get Ldap Group having a local role correspondance
    const ldapMatches = await db.DistantUser.findAll()

    //Flatten known LdapGroup in Array
    let knownLdapGroups = ldapMatches.map((match) => { return match.ldap_group })

    //Get user's group from LDAP
    let userLdapGroups = await ldap.getGroupMembershipForUser(this.ldapUsername)

    //Loop user's group until we found a known group having a local role
    for (let i = 0; userLdapGroups; i++) {

      //Get and return the first match
      if (knownLdapGroups.includes(userLdapGroups[i].cn)) {

        let local_role = ldapMatches.filter((match) => {
          return match.ldap_group === userLdapGroups[i].cn
        })

        //get Role data and return it to controller
        let role = await db.Role.findOne((
          {
            where: { name: local_role[0].local_role }
          }
        ))

        return role
      }

    }


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

    }).catch(error => { throw error })

  }

}

module.exports = Users
