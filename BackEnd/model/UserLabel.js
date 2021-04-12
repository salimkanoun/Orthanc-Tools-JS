const UserLabelRepo = require('../repository/UserLabel.js')
const {OTJSConflictException} = require('../Exceptions/OTJSErrors')

class UserLabel{
  static async createUserLabel(user_id,label_name)
  {
    const userlabel = await UserLabelRepo.getUserLabel(user_id,label_name)


    if(userlabel){
      throw new OTJSConflictException('This association userLabel already exist');
    }

    return UserLabelRepo.create(user_id,label_name)
  }

  static async deleteUserLabel(user_id,label_name){
    return UserLabelRepo.delete(user_id,label_name)
  }

  static async getAll(){
    return UserLabelRepo.getAllUserLabel()
  }
}

module.exports = UserLabel
