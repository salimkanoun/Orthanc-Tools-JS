const db = require('../database/models')

class UserLabel{
  static findOne(user_id,label_name){
    return db.UserLabel.findOne({
      where:{
        user_id:user_id,
        label_name:label_name
      }
    })
  }

  static create(user_id,_label_name){
    return db.UserLabel.create({
      user_id:user_id,
      label_name:label_name
    })
  }

  static destroy(user_id,label_name){
    return db.UserLabel.destroy({
      where:{
        user_id:user_id,
        label_name:label_name
      }
    })
  }

  static findAll(){
    return db.UserLabel.findAll()
  }
}

module.exports = UserLabel