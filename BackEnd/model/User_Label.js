const db = require('../database/models')
const {OTJSConflictException, OTJSBadRequestException} = require('../Exceptions/OTJSErrors')

class User_Label{
  static async createUserLabel(user_id,label_name)
  {
    const user_label = await db.User_Label.findOne({
      where:{
        user_id:user_id,
        label_name:label_name
      }
    })

    if(user_label){
      throw new OTJSConflictException('This association user_label already exist');
    }

    return db.User_Label.create({
      user_id:user_id,
      label_name:label_name
    }).catch( (e) => {throw e})
  }

  static async deleteUserLabel(user_id,label_name){
    return db.User_Label.destroy({
      where:{user_id:user_id,
      label_name:label_name
    }
    }).catch( (e) => {throw e})
  }

  static async getAll(){
    return db.User_Label.findAll().catch((e)=>{throw(e)});
  }

}


module.exports = User_Label
