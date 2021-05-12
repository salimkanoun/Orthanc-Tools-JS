const Autorouter = require('../repository/Autorouter')
const {OTJSConflictException} = require('../Exceptions/OTJSErrors')

class Autorouters{
  static async createAutorouters(name,rules,target){
    const autorouter = await Autorouter.getOneByName(name)
    if(autorouter)throw new OTJSConflictException('This autorouter already exists !')

    return Autorouter.create(name,rules,target)
  }

  static async getAllAutorouters(){
    return await Autorouter.getAll()
  }

  static async getAutorouterById(id){
    return await Autorouter.getOneById(id)
  }

  static async switchRunning(id,running){
    return await Autorouter.modify(id,null,null,null,running)
  }

  static async modifyAutorouter(id,name=null,rules=null,target=null){
    return await Autorouter.modify(id,name,rules,target,null)
  }

  static async deleteAutorouter(id){
    return await Autorouter.delete(id)
  }
}

module.exports = Autorouters