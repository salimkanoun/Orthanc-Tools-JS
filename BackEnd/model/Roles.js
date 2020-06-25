const db = require('../database/models')

class Roles {

    static async createRoles (payload) {

        const roles = await db.Roles.findOne({ where: { name: payload.name } })
        if(roles) {
            throw new Error('This roles already exist');
        }

        const promise = ( () => {
          db.Roles.create({
            name: payload.name,
            upload: payload.upload,
            content: payload.content,
            anon: payload.anon,
            export_local: payload.exportLocal,
            export_extern: payload.exportExtern,
            query: payload.query,
            auto_query: payload.autoQuery,
            delete: payload.delete,
            admin: payload.admin
          })
        }).then(() => {
          return true
        }).catch(function (error) {
          throw new Error('Roles Creation Failed' + error)
        })
    
        return promise
      }

    static async getAllRoles () {
      try {
        return await db.Role.findAll(
            {attributes: ['name']}
        )
      } catch (error) {
        console.log(error)
      }
    }

    static async getPermission (name) {
        return await db.Roles.findAll({ where: { name: name }, attributes: ['upload',
            'content',
            'anon',
            'export_local',
            'export_extern',
            'query',
            'auto_query',
            'delete',
            'admin']}).catch((error) => console.log(error)) //return a JSON
    }

    
    static async deleteRoles(name){
        //TODO
    }

    static async modifyRoles(name, payload){
        //TODO
    }

}

module.exports = Roles