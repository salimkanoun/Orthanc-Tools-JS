const Role = require('../repository/Role')
const {OTJSConflictException, OTJSBadRequestException} = require('./../Exceptions/OTJSErrors');
const RoleEntity = require('./Entities/RoleEntity');
 
class Roles {

  static async createRoles(payload) {

    const roles = await Role.getRole(payload.name)

    if (roles) {
      throw new OTJSConflictException('This roles already exist');
    }

    return Role.create(payload.name,
        payload.import,
        payload.content,
        payload.anon,
        payload.exportLocal,
        payload.exportRemote,
        payload.query,
        payload.autoQuery,
        payload.delete,
        payload.modify,
        payload.cdBurner,
        payload.autorouting,
        payload.admin)
  }

  static async getAllRoles() {
    return Role.getAllRole()
  }

  static async getRole(name) {
    let role = await Role.getRole(name)
    console.log(name, role)
    return RoleEntity.createRolefromDB(role)
  }

  static deleteRole(name) {
    if (name === 'admin') throw new OTJSBadRequestException('Can\'t delete Admin Role')
    return Role.delete(name)
  }

  static modifyRoles(name, payload) {
    if (name === 'admin') throw new OTJSBadRequestException('Can\'t modify Admin Role')
    return Role.update(
      name,
      payload.import,
      payload.content,
      payload.anon,
      payload.exportLocal,
      payload.exportRemote,
      payload.query,
      payload.autoQuery,
      payload.delete,
      payload.modify,
      payload.cdBurner,
      payload.autorouting,
      payload.admin)
  } 

}

module.exports = Roles