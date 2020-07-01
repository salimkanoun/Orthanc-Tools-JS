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
        admin: false
      }).catch(e => console.log(e))
    })

    return promise
  }

  static async deleteUser (username) {
    let user = new Users(username)
    
    if(await user.isAdmin()) throw 'Can\'t delete superAdmin'
  
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
    let user = new Users(data.username)
    
    if(await user.isAdmin() && data.role !=='admin') throw 'Can\'t modify superAdmin\'s role'

    const saltRounds = 10

    if(data.password ==! null) {
      try {
        const promise = bcrypt.hash(data.password, saltRounds).then(function (hash) {db.User.upsert({
          password: data.password
        })
      })
      } catch (error) {
        console.log(error)
      }
    }

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

  async getLocalUserRight() {
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
        attributes: ['import', 'content', 'anon', 'export_local', 'export_extern','query', 'auto_query', 'delete', 'admin','modify'],
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

  async getLDAPUserRight () {
    //todo
  }  

  async getUserRight(){

      const mode = await db.Option.findOne({ 
        attributes: ['ldap'],
        where: {id: '1'}
      });

      try {
          if(mode.ldap && this.username.indexOf('@') !== -1) {
            //LDAP user
            return this.getLDAPUserRight();

          } else {
            //Local user
            return this.getLocalUserRight();
            
          }

    } catch(err) {
      console.log(err)
    }
  }

}

module.exports = Users
