const db = require ('../database/models')

class LdapOption{
  static findOneLdap(){
    return db.LdapOptions.findOne({where:{id:1}})
  }
}

module.exports=LdapOption