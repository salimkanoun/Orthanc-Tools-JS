const db = require ('../database/models')

class LdapOption{
  static getOneLdap(){
    return db.LdapOptions.findOne({where:{id:1}})
  }
}

module.exports=LdapOption