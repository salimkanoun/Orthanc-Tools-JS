const db = require('../database/models')

class Option{
  static findOneAuthenticationMode(){
    return db.Option.findOne({
      attributes: ['ldap'],
      where: { id: '1' }
    })
  }

  static findOneById(id){
    return db.Option.findOne(({ where: { id: id} }))
  }

}

module.exports=Option