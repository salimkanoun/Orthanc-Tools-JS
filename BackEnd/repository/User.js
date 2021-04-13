const db = require('../database/models')
const {OTJSDBEntityNotFoundException} = require ('../Exceptions/OTJSErrors')

class User{
  static getUser(username){
    return db.User.findOne({
      where:{username:username}
    })
  }

  static getAllUser(){
    return db.User.findAll()
  }

  static delete(username){
    const user = User.getUser(username)
    if(user==null){
      throw new OTJSDBEntityNotFoundException('This user doesn\'t exist')
    }
    
    return db.User.destroy({
      where:{username:username}
    })
  }

  static findAndCountAllSuperUser(){
    return db.User.findAndCountAll({where: {super_admin:true}})
  }

  static create(username, firstname, lastname, email, password, role, super_admin){
    return db.User.create({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        role: role,
        super_admin: super_admin
    })
  }

}

module.exports = User