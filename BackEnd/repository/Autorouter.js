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

  static async create(name,condition,rules,target,destination){
    return db.Autorouter.create({
      name:name,
      condition:condition,
      rules:rules,
      target:target,
      destination:destination
    })
  }

  static async modify(id,name,condition,rules,target,running,destination){
    let autorouter = this.getOneById(id)
    if(autorouter==null)throw new OTJSDBEntityNotFoundException('This Autorouter doesn\'t exist')

    let modify = {id:id}
    if(name){modify.name=name}
    if(condition){modify.condition=condition}
    if(rules) {modify.rules=rules}
    if(target) {modify.target=target}
    if(running!==null) {modify.running=running}
    if(destination) {modify.destination=destination}

    return db.Autorouter.update(modify,{where:{id:id}})
  }

  static async delete(id){
    let autorouter = this.getOneById(id)
    if(autorouter==null)throw new OTJSDBEntityNotFoundException('This Autorouter doesn\'t exist')
    return db.Autorouter.destroy({where:{id:id}})
  }
}

module.exports=Autorouter