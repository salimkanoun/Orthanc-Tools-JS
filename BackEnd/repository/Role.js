const db = require('../database/models')

class Role{

  static findOne(name){
    return db.Role.findOne({
      where:{name:name}
    })
  }

  static findAllName(){
    return db.Role.findAll({attributes:['name']}.catch((error) => { throw error }))
  }

  static create(payload){
    return db.Role.create({
      name: payload.name,
      import: payload.import,
      content: payload.content,
      anon: payload.anon,
      export_local: payload.exportLocal,
      export_extern: payload.exportExtern,
      query: payload.query,
      auto_query: payload.autoQuery,
      delete: payload.delete,
      modify: payload.modify,
      cd_burner: payload.cd_burner,
      admin: payload.admin
    })
  }

  static findAllByName(name){
    return db.Role.findAll({where:{name:name}})
  }

  static destroy(name){
    return db.Role.destroy({where:{name:name}})
  }

  static upsert(name,payload){
    return db.Role.upsert({
      name: name,
      content: payload.content,
      anon: payload.anon,
      export_local: payload.exportLocal,
      export_extern: payload.exportExtern,
      query: payload.query,
      auto_query: payload.autoQuery,
      delete: payload.delete,
      admin: payload.admin,
      modify: payload.modify,
      import: payload.import,
      cd_burner: payload.cd_burner
    })
  }

}

module.exports=Role