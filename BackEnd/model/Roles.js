const db = require('../database/models')
const jwt = require("jsonwebtoken")

class Roles {

    static async createRoles (payload) {
        console.log(payload)
        const roles = await db.Role.findOne({ 
          where: { name: payload.name }})
        if(roles) {
            throw new Error('This roles already exist');
        }

        const promise = db.Role.create({
            name: payload.name,
            upload: payload.upload,
            content: payload.content,
            anon: payload.anon,
            export_local: payload.exportLocal,
            export_extern: payload.exportExtern,
            query: payload.query,
            auto_query: payload.autoQuery,
            delete: payload.delete,
            modify: payload.modify,
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
        return await db.Role.findAll({ where: { name: name }, attributes: ['upload',
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

    static async deleteRole(name){
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
          upload: payload.upload,
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

    static async getRoleFromToken(token){
      
      try { 
        return jwt.verify(token, process.env.TOKEN_SECRET) 
      } 
      catch(err) {
        console.log(err)
        throw res.sendStatus(403)//if incorrect token
      }
    }

}

module.exports = Roles