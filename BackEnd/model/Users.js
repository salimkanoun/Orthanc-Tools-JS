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

  static async createUser (username, password, isAdmin) {
    const saltRounds = 10

    const promise = bcrypt.hash(password, saltRounds).then(function (hash) {
      db.User.create({
        username: username,
        password: hash,
        admin: isAdmin
      })
    }).then(() => {
      return true
    }).catch(function (error) {
      throw new Error('User Creation Failed' + error)
    })

    return promise
  }
}

module.exports = Users
