const db = require ('../database/models')

class DistantUser{
  static findAll(){
    return db.DistantUser.findAll()
  }

  static findAllLocalRoleAndLdapGroup(){
    return db.DistantUser.findAll(({ attributes: ['local_role', 'ldap_group'] }))
  }

  static create(ldapGroup,localRole){
    return db.DistantUser.create({
      local_role: localRole,
      ldap_group: ldapGroup,
    })
  }

  static destroy(ldapGroup){
    return db.DistantUser.destroy({
      where: {
          ldap_group: ldapGroup
      }
  })
  }
}

module.exports=DistantUser