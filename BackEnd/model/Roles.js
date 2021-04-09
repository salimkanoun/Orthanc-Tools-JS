const db = require('../database/models')^ù
const Role = require('../repository/Role')
const {OTJSConflictException, OTJSBadRequestException} = require('./../Exceptions/OTJSErrors')
 
class Roles {

  static async createRoles(payload) {

    const roles = await Role.findOne(payload.name)

    if (roles) {
      throw new OTJSConflictException('This roles already exist');
    }

    return Role.create(payload)
  }

  static async getAllRoles() {
    return Role.findAllName
  }

  static getPermission(name) {
    return Role.findAllByName(name)
  }

  static deleteRole(name) {
    if (name === 'admin') throw new OTJSBadRequestException('Can\'t delete Admin Role')
    return Role.destroy(name)
  }

  static modifyRoles(name, payload) {
    if (name === 'admin') throw new OTJSBadRequestException('Can\'t modify Admin Role')
    return Role.upsert(name,payload)
  } 

}

module.exports = Roles