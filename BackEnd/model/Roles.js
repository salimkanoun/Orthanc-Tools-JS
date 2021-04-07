const db = require('../database/models')
const {OTJSConflictException, OTJSBadRequestException} = require('./../Exceptions/OTJSErrors')
 
class Roles {

  static async createRoles(payload) {

    const roles = await db.Role.findOne({
      where: { name: payload.name }
    })

    if (roles) {
      throw new OTJSConflictException('This roles already exist');
    }

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

  static async getAllRoles() {
    return db.Role.findAll(
      { attributes: ['name'] }
    )
  }

  static getPermission(name) {
    return db.Role.findAll({ where: { name: name } }).catch((error) => { throw error })
  }

  static deleteRole(name) {
    if (name === 'admin') throw new OTJSBadRequestException('Can\'t delete Admin Role')
    return db.Role.destroy({
      where: {
        name: name
      }
    }).catch((error) => { throw error })
  }

  static modifyRoles(name, payload) {
    if (name === 'admin') throw new OTJSBadRequestException('Can\'t modify Admin Role')

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

module.exports = Roles