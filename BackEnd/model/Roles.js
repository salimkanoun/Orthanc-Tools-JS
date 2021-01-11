const db = require('../database/models')
const jwt = require("jsonwebtoken")

class Roles {

    static async createRoles (payload) {
        const roles = await db.Role.findOne({ 
          where: { name: payload.name }})
        if(roles) {
            throw new Error('This roles already exist');
        }

        const promise = db.Role.create({
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
            cd_burner : payload.cd_burner, 
            admin: payload.admin
          }).catch(e => console.log(e))
    
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
        return await db.Role.findAll({ where: { name: name }}).catch((error) => console.log(error)) //return a JSON
    }

    static async deleteRole(name){
      if(name === 'admin') throw 'Can\'t delete role admin'

      try {
        await db.Role.destroy({
        where: {
            name: name
        }
      })
      } catch (error) {
        console.log(error)
      }
    }

    static async modifyRoles(name, payload){
      if(name === 'admin') throw 'Can\'t modify role admin'

      try {
        await db.Role.upsert({
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
          cd_burner : payload.cd_burner
        })
      } catch (error) {
        console.error(error)
      }
    }

}

module.exports = Roles