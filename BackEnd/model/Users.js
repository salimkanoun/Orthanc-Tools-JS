const bcrypt = require('bcryptjs')
const db = require('../database/models')
const AdClient = require('../ldap/adClient')

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

  async checkLDAPPassword (plainPassword, callback) {
    let username = this.username;
    if(this.username.indexOf('@') === 0) {
      username = username.substr(1)
    }

    const option = await db.LdapOptions.findOne(({ where: { id: 1 }, attributes: ['TypeGroupe',
        'protocole',
        'adresse',
        'port',
        'DN',
        'mdp','user','groupe','base'] }))

        let client;
        if(option.TypeGroupe === 'ad') {
            client = new AdClient(option.TypeGroupe, option.protocole, option.adresse, option.port, option.DN, option.mdp, option.base, option.user, option.groupe )
          } else if(option.TypeGroupe === 'ldap') {
            //ToDo
            throw 'ToDo'
        } else {
            throw 'inccorect TypeGroupe'
        }
        await client.autentification(username, plainPassword, function(response) { 
          return callback(response)
        })
  }

  async checkLocalPassword (plainPassword, callback) {
    const user = await this._getUserEntity()
    const check = await bcrypt.compare(plainPassword, user.password).catch(() => { return false })
    return callback(check)
  }

  async checkPassword (plainPassword, callback) {
   
    const mode = await db.Option.findOne({ 
      attributes: ['ldap'],
      where: {id: '1'}
    });

    try {
        if(mode.ldap && this.username.indexOf('@') !== -1) {
          //LDAP user
          await this.checkLDAPPassword(plainPassword, async function(response) {
            return await callback(response)
          });

        } else {
          //Local user
          await this.checkLocalPassword(plainPassword, async function(response) {
            return await callback(response)
          });
          
        }
    } catch(err) {
      console.log(err)
    }
  }

  async isAdmin () {
    const user = await this._getUserEntity()
    return user.admin
  }

  static async createUser (body) {

    if(body.username.indexOf('@') !== -1) throw new Error('@ is forbiden') 

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
    
    if(data.username.indexOf('@') !== -1) throw '@ is forbiden'

    let user = new Users(data.username)
    
    if(await user.isAdmin() && data.role !=='admin') throw 'Can\'t modify superAdmin\'s role'

    const saltRounds = 10

    if(data.password !== null) {
      try {
        const promise = bcrypt.hash(data.password, saltRounds).then(function (hash) {db.User.upsert({
          id: data.id,
          password: hash
        })
      })
      } catch (error) {
        console.log(error)
      }
    }

  try {
      const mod = await db.User.findOne(({ where: { id:data.id } }))
      mod.id = data.id
      mod.username = data.username, 
      mod.isAdmin = data.admin, 
      mod.first_name = data.first_name, 
      mod.last_name = data.last_name, 
      mod.mail = data.mail, 
      mod.role = data.role
      await mod.save()
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

  async getLocalUserRight(callback) {
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
        return callback(rights)
      }
  }

  async getLDAPUserRight(callback) { 
    let username = this.username;
    if(this.username.indexOf('@') === 0) {
      username = username.substr(1)
    }

    const option = await db.LdapOptions.findOne(({ where: { id: 1 }, attributes: ['TypeGroupe',
        'protocole',
        'adresse',
        'port',
        'DN',
        'mdp','user','groupe','base'] }))

        let client;
        if(option.TypeGroupe === 'ad') {
            client = new AdClient(option.TypeGroupe, option.protocole, option.adresse, option.port, option.DN, option.mdp, option.base, option.user, option.groupe )
          } else if(option.TypeGroupe === 'ldap') {
            //ToDo
            throw 'ToDo'
        } else {
            throw 'inccorect TypeGroupe'
        }

        const opt = await db.DistantUser.findAll(({attributes: ['groupName'] }))
        const roles = []; 
        for(let u=0;u<opt.length;u++) {roles.push(opt[u].dataValues.groupName)}

    await client.getPermission(username, roles, async function(response) { 
      
      let res = {
        import:false,
        content:false,
        anon:false,
        export_local:false,
        export_extern:false,
        query:false,
        auto_query:false,
        delete:false,
        admin:false,
        modify:false
      }

      for(let i=0;i<response.length;i++) {

        let resp = await db.DistantUser.findOne(({where: {groupName: response[i]}, attributes: ['roleDistant'] }))
        let role = await resp.dataValues.roleDistant; 

        let option = await db.Role.findOne(({ where: { name: role }, attributes: ['import',
        'content',
        'anon',
        'export_local',
        'export_extern',
        'query','auto_query','delete','admin','modify'] }))

        res = {
          import:res.import || option.dataValues.import,
          content:res.content || option.dataValues.content,
          anon:res.anon || option.dataValues.anon,
          export_local:res.export_local || option.dataValues.export_local,
          export_extern:res.export_extern || option.dataValues.export_extern,
          query:res.query || option.dataValues.query,
          auto_query:res.auto_query || option.dataValues.auto_query,
          delete:res.delete || option.dataValues.delete,
          admin:res.admin || option.dataValues.admin,
          modify:res.modify || option.dataValues.modify
        }

        console.log(res)
      }

      return callback(res)
    })
  }  

  async getUserRight(callback){
      const mode = await db.Option.findOne({ 
        attributes: ['ldap'],
        where: {id: '1'}
      });

      try {
          if(mode.ldap && this.username.indexOf('@') !== -1) {
            //LDAP user
            await this.getLDAPUserRight(async function(response) {
              return await callback(response)
            });

          } else {
            //Local user
            await this.getLocalUserRight(async function(response) {
              return await callback(response)
            });            
          }

    } catch(err) {
      console.log(err)
    }
  }

}

module.exports = Users
