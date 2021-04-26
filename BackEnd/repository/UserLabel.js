const db = require('../database/models')
const { OTJSDBEntityNotFoundException } = require('../Exceptions/OTJSErrors')

class UserLabel{
  static getUserLabel(user_id,label_name){
    return db.UserLabel.findOne({
      where:{
        user_id:user_id,
        label_name:label_name
      }
    })
  }
  static getLabelsById(id){
    return db.UserLabel.findAll({
      where:{
        user_id:id
      },attributes:['label_name']
    })
  }

  static create(user_id,label_name){
    return db.UserLabel.create({
      user_id:user_id,
      label_name:label_name
    })
  }

  static delete(user_id,label_name){
    const user_label = UserLabel.getUserLabel(user_id,label_name)
    if(user_label==null){
      throw new OTJSDBEntityNotFoundException('This UserLabel doesn\'t exist')
    }

    return db.UserLabel.destroy({
      where:{
        user_id:user_id,
        label_name:label_name
      }
    })
  }

  static getAllUserLabel(){
    return db.UserLabel.findAll()
  }
}

module.exports = UserLabel