const db = require('../database/models')

class User{
  static findOne(username){
    return db.User.findOne({
      where:{username:username}
    })
  }

  static findAll(){
    return db.User.findAll()
  }

  static destroy(username){
    return db.User.destroy({
      where:{username:username}
    })
  }

  static findAndCountAllSuperUser(){
    return db.User.findAndCountAll({where: {suuper_admin:true}})
  }

  static create(username, firstname, lastname, email, password, role, super_admin){
    return db.User.create({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hash,
        role: role,
        super_admin: super_admin
    })
  }

}

module.exports = User