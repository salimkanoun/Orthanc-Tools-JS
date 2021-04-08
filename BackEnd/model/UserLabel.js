const db = require('../database/models')
const {OTJSConflictException, OTJSBadRequestException} = require('../Exceptions/OTJSErrors')

class UserLabel{
  static async createUserLabel(user_id,label_name)
  {
    const userlabel = await db.UserLabel.findOne({
      where:{
        user_id:user_id,
        label_name:label_name
      }
    })

    if(userlabel){
      throw new OTJSConflictException('This association userLabel already exist');
    }

    return db.UserLabel.create({
      user_id:user_id,
      label_name:label_name
    }).catch( (e) => {throw e})
  }

  static async deleteUserLabel(user_id,label_name){
    return db.UserLabel.destroy({
      where:{user_id:user_id,
      label_name:label_name
    }
    }).catch( (e) => {throw e})
  }

  static async getAll(){
    return db.UserLabel.findAll().catch((e)=>{throw(e)});
  }

}


module.exports = UserLabel
