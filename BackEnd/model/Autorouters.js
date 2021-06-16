const Autorouter = require('../repository/Autorouter')
const {OTJSConflictException} = require('../Exceptions/OTJSErrors')

class Autorouters{
  /**
   * Create an autorouter
   * @param {String} name name of the autorouter
   * @param {String} condition "OR" / "AND" rule checking condition
   * @param {Array.<JSON>} rules rules to check
   * @param {String} target target of the event listener (by default StableStudies for v1)
   * @param {Array.<String>} destination arry of aets name
   * @returns 
   */
  static async createAutorouters(name,condition,rules,target,destination){
    const autorouter = await Autorouter.getOneByName(name)
    if(autorouter)throw new OTJSConflictException('This autorouter already exists !')
    return Autorouter.create(name,condition,rules,target,destination)
  }

  /**
   * Get all autorouters
   * @returns 
   */
  static async getAllAutorouters(){
    return await Autorouter.getAll()
  }

  /**
   * Get autourouter's details 
   * @param {Number} id 
   * @returns 
   */
  static async getAutorouterById(id){
    return await Autorouter.getOneById(id)
  }

  /**
   * Turn on/off an autorouter
   * @param {Number} id 
   * @param {boolean} running 
   * @returns 
   */
  static async switchRunning(id,running){
    return await Autorouter.modify(id,null,null,null,null,running,null)
  }

  /**
   * Modify the content of an autorouter
   * @param {number} id id of the autorouter 
   * @param {*} name (null if not modified) name of the autorouter
   * @param {*} condition (null if not modified) condition of the autorouter
   * @param {*} rules (null if not modified) rules of the autorouter
   * @param {*} target (null if not modified) target of the autorouter
   * @param {*} destination (null if not modified) aets names of the autorouter
   * @returns 
   */
  static async modifyAutorouter(id,name=null,condition=null,rules=null,target=null,destination=null){
    return await Autorouter.modify(id,name,condition,rules,target,null,destination)
  }

  /**
   * Delete an autorouter with its ID
   * @param {number} id 
   * @returns 
   */
  static async deleteAutorouter(id){
    return await Autorouter.delete(id)
  }
}

module.exports = Autorouters