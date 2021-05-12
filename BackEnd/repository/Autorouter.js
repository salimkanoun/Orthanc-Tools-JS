const db = require("../database/models");
const {OTJSDBEntityNotFoundException} = require("../Exceptions/OTJSErrors");

class Autorouter{
  static async getAll(){
    return db.Autorouter.findAll()
  }

  static async getOneByName(name){
    return db.Autorouter.findOne(
      {where:{
        name:name
      }}
    )
  }

  static async getOneById(id){
    return db.Autorouter.findOne(
      {where:{
        id:id
      }}
    )
  }

  static async create(name,rules,target){
    return db.Autorouter.create({
      name:name,
      rules:rules,
      target:target
    })
  }

  static async modify(id,name,rules,target,running){
    let autorouter = this.getOneById(id)
    if(autorouter==null)throw new OTJSDBEntityNotFoundException('This Autorouter doesn\'t exist')

    let modify = {}
    if(name) modify.name=name
    if(rules) modify.rules=rules
    if(target) modify.target=target
    if(running) modify.running=running

    return db.Autorouter.update(modify,{where:{id:id}})
  }

  static async delete(id){
    let autorouter = this.getOneById(id)
    if(autorouter==null)throw new OTJSDBEntityNotFoundException('This Autorouter doesn\'t exist')
    return db.Autorouter.destroy({where:{id:id}})
  }
}

module.exports=Autorouter