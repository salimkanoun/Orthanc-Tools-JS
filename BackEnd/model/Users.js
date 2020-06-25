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
      try {
        const user = await db.User.findOne({ where: { username: this.username } })
        if (user === null) {
          throw new Error('User Not Found')
        }
        this.user = user
        return this.user
      } catch (error) {
        console.log(error)
      }
      
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
    let id = null
    await db.User.max('id').then(max => id = max + 1).catch((error) => console.log(error))
    const promise = bcrypt.hash(body.password, saltRounds).then(function (hash) {
      db.User.create({
        id: id,
        username: body.username,
        first_name: body.firstName,
        last_name: body.lastName,
        mail: body.mail,
        password: hash,
        role: body.role,
        admin: true
      }).catch(function (error){
        console.log(error, body)
      })
    }).then(() => {
      return true
    }).catch(function (error) {
      console.log(error)
    })

    return promise
    
  }

  static async deleteUser (username) {
    try {
      await db.User.destroy({
      where: {
          username: username
      }
    })
    } catch (error) {
      console.log(error)
    }
  }

  static async modifyUser(data){
     try {
      await db.User.upsert({
        id: data.id,
        username: data.username, 
        isAdmin: data.admin, 
        first_name: data.first_name, 
        last_name: data.last_name, 
        mail: data.mail, 
        role: data.role
      })
    } catch (error) {
      console.log(error)
    }
}

  static async getUsers(){
    
    let users;
    
    try{
        users = await db.User.findAll({
        attributes: ['id', 'username', 'first_name', 'last_name', 'admin', 'mail', 'role']
      })
      if (users === null) {
        throw new Error('User Not Found')
      }
      } catch (error) {
        console.log(error)
    } finally {
      return users
    }
    
  }

  async getInfoUser(){
    
    let user;
    
    try {
        user = await db.User.findOne({ 
        where: {username: this.username}
      });
      if (user === null) {
        throw new Error('User Not Found')
      }
      } catch(error) {
        console.log(error)
    } finally {
      return user
    }
    
  }

  async getUserRight(){

    let rights;

    try {
      const user = await db.User.findOne({ 
        attributes: ['role'],
        where: {username: this.username}
      });

      if (user === null) {
        throw new Error('User Not Found')
      }

        rights = await db.Role.findOne({
        attributes: ['upload', 'content', 'anon', 'export_local', 'export_extern','query', 'auto_query', 'delete', 'admin','modify'],
        where: {name: user.role}
      });

      if (rights === null) {
        throw new Error('Rights Not Found')
      }
      } catch (error) {
      console.log(error)
      } finally {
        return rights
      }
      
  }
}

module.exports = Users
