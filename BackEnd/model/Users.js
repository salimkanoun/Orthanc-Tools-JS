const bcrypt = require('bcryptjs')
const db = require('../database/models')

class Users {
  constructor (username) {
    this.username = username
  }

  async _getUserEntity () {
    if (this.user !== undefined) {
      return this.user
    } else {
      const user = await db.User.findOne({ where: { username: this.username } })
      if (user === null) {
        throw new Error('User Not Found')
      }
      this.user = user
      return this.user
    }
  }

  async checkPassword (plainPassword) {
    const user = await this._getUserEntity()
    const check = await bcrypt.compare(plainPassword, user.password).catch(() => { return false })
    return check
  }

  async isAdmin () {
    const user = await this._getUserEntity()
    return user.admin
  }

  static async createUser (body) {
    const saltRounds = 10
    const promise = bcrypt.hash(body.password, saltRounds).then(function (hash) {
      db.User.create({/**
         username: 'test',
        first_name: body.first_name,
        last_name: body.last_name,
        mail: body.mail,
        password: hash,
        */
        username: 'test',
        first_name: 'test',
        last_name: 'test',
        mail: 'test',
        password: 'test',
        admin: true, 
        role: 'admin'
      })
    }).then(() => {
      return true
    }).catch(function (error) {
      console.log(error)
    })

    return promise
  }

  static async deleteUser (username) {

    await db.Users.destroy({
      where: {
          username: username
      }
    })
  }

  static async modifyUser(username, password, isAdmin, role, firstName, lastName, mail){
    await db.Users.destroy({
        where: {
            username: username
        }
    })
    try {
        Users.createUser(username, password, isAdmin, role, firstName, lastName, mail)
    } catch (error){
        throw new Error('Fail to modify' + error)
    }
    
}

  static async getUsers(){
      const users = await db.User.findAll({
        attributes: ['id', 'username', 'first_name', 'last_name', 'admin', 'mail', 'role']
      })
      if (users === null) {
        throw new Error('User Not Found')
      }
    return users
  }

  async getInfoUser(){
    const user = await db.User.findOne({ 
      where: {username: this.username}
    });
    if (user === null) {
      throw new Error('User Not Found')
    }
    return user
  }

  async getUserRight(){
    const user = await db.User.findOne({ 
      attributes: ['role'],
      where: {username: this.username}
    });

    const rights = await db.Role.findOne({
      attributes: ['upload', 'content', 'anon', 'export_local', 'export_extern','query', 'auto_query', 'delete', 'admin'],
      where: {name: user.role}
    });

    console.log("TEST")
    console.log(rights.export_local)

    if (user === null) {
      throw new Error('User Not Found')
    }
    return "rights"
  }

}

module.exports = Users
