const bcrypt = require('bcrypt')
const db = require('../database/models')

class Users {

  constructor (username) {
    this.username = username
  }

  async checkPassword (plainPassword) {
    const user = await db.User.findOne({ where: { username: this.username } })
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
    }).catch(function (error) {
      console.log('user create Failed ' + error)
    })

    return promise
  }
}

module.exports = Users
