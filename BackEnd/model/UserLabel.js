const db = require('../database/models')
const UserLabel = require('../repository/UserLabel.js')
const {OTJSConflictException} = require('../Exceptions/OTJSErrors')

class UserLabel{
  static async createUserLabel(user_id,label_name)
  {
    const userlabel = await UserLabel.findOne(user_id,label_name)


    if(userlabel){
      throw new OTJSConflictException('This association userLabel already exist');
    }

    return UserLabel.create(user_id,label_name)
  }

  static async deleteUserLabel(user_id,label_name){
    return UserLabel.destroy(user_id,label_name)
  }

  static async getAll(){
    return UserLabel.getAll()
  }
}

module.exports = UserLabel
