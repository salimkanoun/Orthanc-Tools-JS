const db = require('../database/models')

class Option{
  static getOneAuthenticationMode(){
    return db.Option.findOne({
      attributes: ['ldap'],
      where: { id: '1' }
    })
  }

  static getOptionById(id){
    return db.Option.findOne(({ where: { id: id} }))
  }

}

module.exports=Option