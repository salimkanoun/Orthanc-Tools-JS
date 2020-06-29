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
            import: payload.import,
            content: payload.content,
            anon: payload.anon,
            export_local: payload.exportLocal,
            export_extern: payload.exportExtern,
            query: payload.query,
            auto_query: payload.autoQuery,
            delete: payload.delete,
            modify: payload.modify,
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
        await db.Role.findAll(
            {attributes: ['name']}
        ).then((answer) => {
            return answer
        }).catch((error) => console.log(error))
    }

    static async getPermission (name) {
        return await db.Roles.findAll({ where: { name: name }, attributes: ['import',
            'content',
            'anon',
            'export_local',
            'export_extern',
            'query',
            'auto_query',
            'delete',
            'admin',
            'modify']}).catch((error) => console.log(error)) //return a JSON
    }

    static async deleteRoles(name){
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
      try {
        await db.Role.upsert({
          name: name,
          import: payload.import,
          content: payload.content,
          anon: payload.anon,
          export_local: payload.exportLocal,
          export_extern: payload.exportExtern,
          query: payload.query,
          auto_query: payload.autoQuery,
          delete: payload.delete,
          modify: payload.modify,
          admin: payload.admin
        })
      } catch (error) {
        console.log(error)
      }
    }

}

module.exports = Roles