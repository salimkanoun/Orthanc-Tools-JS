const Role = require('../repository/Role')
const {OTJSConflictException, OTJSBadRequestException} = require('./../Exceptions/OTJSErrors')
 
class Roles {

  static async createRoles(payload) {

    const roles = await Role.getRole(payload.name)

    if (roles) {
      throw new OTJSConflictException('This roles already exist');
    }

    return Role.create(payload.name,payload.import,payload.content,payload.anon,payload.exportLocal,payload.exportExtern,payload.query,payload.autoQuery,payload.deleteR,payload.modify,payload.cd_burner,payload.autorouting,payload.admin)
  }

  static async getAllRoles() {
    return Role.getAllRole()
  }

  static getPermission(name) {
    return Role.getRoleByName(name)
  }

  static deleteRole(name) {
    if (name === 'admin') throw new OTJSBadRequestException('Can\'t delete Admin Role')
    return Role.delete(name)
  }

  static modifyRoles(name, payload) {
    if (name === 'admin') throw new OTJSBadRequestException('Can\'t modify Admin Role')
    return Role.update(name,payload.import,payload.content,payload.anon,payload.exportLocal,payload.exportExtern,payload.query,payload.autoQuery,payload.deleteR,payload.modify,payload.cd_burner,payload.autorouting,payload.admin)
  } 

}

module.exports = Roles