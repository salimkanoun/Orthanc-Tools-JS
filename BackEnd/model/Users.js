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

  static async createUser (username, password, isAdmin, role, firstName, lastName, mail) {
    const saltRounds = 10

    const promise = bcrypt.hash(password, saltRounds).then(function (hash) {
      db.User.create({
        first_name:firstName,
        last_name: lastName,
        mail: mail,
        username: username,
        password: hash,
        admin: isAdmin, 
        role: role
      })
    }).then(() => {
      return true
    }).catch(function (error) {
      throw new Error('User Creation Failed' + error)
    })

    return promise
  }

  static async deleteUser (username) {

    db.Users.destroy({
      where: {
          username: username
      }
    })
  }

  static async modifyUser(username, password, isAdmin, role, firstName, lastName, mail){
    db.Users.destroy({
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
        attributes: { exclude: ['password']}
      })
      if (users === null) {
        throw new Error('User Not Found')
      }
    return users
  }
}

module.exports = Users
