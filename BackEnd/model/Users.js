const bcrypt = require('bcryptjs')
const db = require('../database/models')
const AdClient = require('../ldap/adClient')

class Users {

  constructor(username) {
    this.username = username
  }

  async _getUserEntity() {
    return db.User.findOne({ where: { username: this.username } })
  }

  isAdmin() {
    return this._getUserEntity().then(user => user.super_admin).catch(() => false)
  }

  async checkLDAPPassword(plainPassword, callback) {
    let username = this.username;
    if (this.username.indexOf('@') === 0) {
      username = username.substr(1)
    }

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

    client.autentification(username, plainPassword, function (response) {
      return callback(response)
    })

  }

  checkLocalPassword(plainPassword) {
    return this._getUserEntity().then(user => {
      return bcrypt.compare(plainPassword, user.password)
    }).catch((error) => { console.error(error); return false })
  }

  async checkPassword(plainPassword, callback) {

    const mode = await db.Option.findOne({
      attributes: ['ldap'],
      where: { id: '1' }
    });

    try {
      if (mode.ldap && this.username.indexOf('@') !== -1) {
        //LDAP user
        this.checkLDAPPassword(plainPassword, function (response) {
          callback(response)
        });

      } else {
        //Local user
        let checkLocal = await this.checkLocalPassword(plainPassword)
        callback(checkLocal)

      }
    } catch (err) {
      console.error(err)
      callback(false)
    }
  }


  static async createUser(username, firstname, lastname, email, password, role, super_admin) {

    if (username.indexOf('@') !== -1) throw new Error('@ is forbiden')

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

  static async modifyUser(id, username, firstname, lastname, password, email, role, isSuperAdmin) {

    if (username.indexOf('@') !== -1) throw '@ is forbiden'

    let user = new Users(username)

    if (await user.isAdmin() && role !== 'admin') throw 'Can\'t modify superAdmin\'s role'

    const mod = await db.User.findOne(({ where: { id: id } }))
    mod.username = username
    mod.firstname = firstname
    mod.lastname = lastname
    mod.super_admin = isSuperAdmin
    mod.email = email

    if (password !== null) {
      mod.password = await bcrypt.hash(password, 10).catch((error) => {
        console.error(error)
      })
    }

    mod.role = role
    await mod.save()

  }

  static async getUsers() {
    return await db.User.findAll()
  }

  async getLocalUserRight(callback) {
    let rights;

    try {
      const user = await db.User.findOne({
        attributes: ['role'],
        where: { username: this.username }
      });

      if (user === null) {
        throw new Error('User Not Found')
      }

      rights = await db.Role.findOne({
        attributes: ['import', 'content', 'anon', 'export_local', 'export_extern', 'query', 'auto_query', 'delete', 'admin', 'modify', 'cd_burner'],
        where: { name: user.role }
      });

      if (rights === null) {
        throw new Error('Rights Not Found')
      }
    } catch (error) {
      console.log(error)
    } finally {
      return callback(rights)
    }
  }

  async getLDAPUserRight(callback) {
    let username = this.username;
    if (this.username.indexOf('@') === 0) {
      username = username.substr(1)
    }

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

    const opt = await db.DistantUser.findAll(({ attributes: ['groupName'] }))
    const roles = [];
    for (let u = 0; u < opt.length; u++) { roles.push(opt[u].dataValues.groupName) }

    await client.getPermission(username, roles, async function (response) {

      let res = {
        import: false,
        content: false,
        anon: false,
        export_local: false,
        export_extern: false,
        query: false,
        auto_query: false,
        delete: false,
        admin: false,
        modify: false
      }

      for (let i = 0; i < response.length; i++) {

        let resp = await db.DistantUser.findOne(({ where: { groupName: response[i] }, attributes: ['roleDistant'] }))
        let role = await resp.dataValues.roleDistant;

        let option = await db.Role.findOne(({
          where: { name: role }, attributes: ['import',
            'content',
            'anon',
            'export_local',
            'export_extern',
            'query', 'auto_query', 'delete', 'admin', 'modify']
        }))

        res = {
          import: res.import || option.dataValues.import,
          content: res.content || option.dataValues.content,
          anon: res.anon || option.dataValues.anon,
          export_local: res.export_local || option.dataValues.export_local,
          export_extern: res.export_extern || option.dataValues.export_extern,
          query: res.query || option.dataValues.query,
          auto_query: res.auto_query || option.dataValues.auto_query,
          delete: res.delete || option.dataValues.delete,
          admin: res.admin || option.dataValues.admin,
          modify: res.modify || option.dataValues.modify
        }

        console.log(res)
      }

      return callback(res)
    })
  }

  async getUserRight(callback) {
    const mode = await db.Option.findOne({
      attributes: ['ldap'],
      where: { id: '1' }
    });

    try {
      if (mode.ldap && this.username.indexOf('@') !== -1) {
        //LDAP user
        await this.getLDAPUserRight(async function (response) {
          return await callback(response)
        });

      } else {
        //Local user
        await this.getLocalUserRight(async function (response) {
          return await callback(response)
        });
      }

    } catch (err) {
      console.error(err)
    }
  }

}

module.exports = Users
