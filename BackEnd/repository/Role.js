const db = require('../database/models')
const {OTJSDBEntityNotFoundException} = require('../Exceptions/OTJSErrors')

class Role{

  static async getRole(name){
    return db.Role.findOne({
      where:{name:name}
    })
  }

  static async getAllRole(){
    return db.Role.findAll().catch((error)=> {throw error})
  }

  static async create(name,importR,content,anon,exportLocal,exportExtern,query,autoQuery,deleteR,modify,cd_burner,autorouting,admin){
    return db.Role.create({
      name: name,
      import: importR,
      content: content,
      anon: anon,
      export_local: exportLocal,
      export_extern: exportExtern,
      query: query,
      auto_query: autoQuery,
      delete: deleteR,
      modify: modify,
      cd_burner: cd_burner,
      autorouting:autorouting,
      admin: admin
    })
  }

  static async getRoleByName(name){
    return db.Role.findAll({where:{name:name}})
  }

  static async delete(name){
    const role = await Role.getRole(name)
    if(role==null){
      throw new OTJSDBEntityNotFoundException('This role doesn\'t exist')
    }
    return db.Role.destroy({where:{name:name}})
  }

  //voir pour faire avec un getEntity, modification de l'entity puis .save()
  static async update(name,importR,content,anon,exportLocal,exportExtern,query,autoQuery,deleteR,modify,cd_burner,autorouting,admin){
    
    const role = await Role.getRole(name)
    if(role==null){
      throw new OTJSDBEntityNotFoundException('This role doesn\'t exist')
    }
    
    role.import = importR
    role.content = content
    role.anon = anon
    role.exportLocal = exportLocal
    role.exportExtern = exportExtern
    role.query = query
    role.autoQuery = autoQuery
    role.delete = deleteR
    role.modify = modify
    role.cd_burner = cd_burner
    role.autorouting = autorouting
    role.admin = admin

    return role.save()
  }

}

module.exports=Role