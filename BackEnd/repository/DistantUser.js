const db = require ('../database/models')

class DistantUser{
  static async getDistantUser(ldapGroup){
    return db.DistantUser.findOne({where:{ldapGroup:ldapGroup}})
  }

  static async getAll(){
    return db.DistantUser.findAll()
  }

  static async getAllLocalRoleAndLdapGroup(){
    return db.DistantUser.findAll(({ attributes: ['local_role', 'ldap_group'] }))
  }

  static async create(ldapGroup,localRole){
    return db.DistantUser.create({
      local_role: localRole,
      ldap_group: ldapGroup,
    })
  }

  static async delete(ldapGroup){
    const distant_user = await DistantUser.getDistantUser(ldapGroup)
    if(distant_user==null){
      throw new OTJSDBEntityNotFoundException('This distant user doesn\'t exist')
    }

    return db.DistantUser.destroy({
      where: {
          ldap_group: ldapGroup
      }
  })
  }
}

module.exports=DistantUser