const db = require('../database/models')
const { OTJSDBEntityNotFoundException } = require('../Exceptions/OTJSErrors')

class Role {

  static async getRole(name) {
    return db.Role.findOne({
      where: { name: name }
    })
  }

  static async getAllRole() {
    return db.Role.findAll().catch((error) => { throw error })
  }

  static async create(name, importR, content, anon, exportLocal, exportRemote, query, autoQuery, deleteRole, modify, cd_burner, autorouting, admin) {
    return db.Role.create({
      name: name,
      import: importR ?? false,
      content: content ?? false,
      anon: anon ?? false,
      export_local: exportLocal ?? false,
      export_remote: exportRemote ?? false,
      query: query ?? false,
      auto_query: autoQuery ?? false,
      delete: deleteRole ?? false,
      modify: modify ?? false,
      cd_burner: cd_burner ?? false,
      autorouting: autorouting ?? false,
      admin: admin ?? false
    })
  }

  static async delete(name) {
    const role = await Role.getRole(name)
    if (role == null) {
      throw new OTJSDBEntityNotFoundException('This role doesn\'t exist')
    }
    return db.Role.destroy({ where: { name: name } })
  }

  //voir pour faire avec un getEntity, modification de l'entity puis .save()
  static async update(name, importR, content, anon, exportLocal, exportRemote, query, autoQuery, deleteRole, modify, cd_burner, autorouting, admin) {

    const role = await Role.getRole(name)
    if (role == null) {
      throw new OTJSDBEntityNotFoundException('This role doesn\'t exist')
    }

    role.import = importR
    role.content = content
    role.anon = anon
    role.exportLocal = exportLocal
    role.exportRemote = exportRemote
    role.query = query
    role.autoQuery = autoQuery
    role.delete = deleteRole
    role.modify = modify
    role.cd_burner = cd_burner
    role.autorouting = autorouting
    role.admin = admin

    return role.save()
  }

}

module.exports = Role