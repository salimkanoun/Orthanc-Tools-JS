const db = require('../database/models')

class Label{

  static findOne(label_name){
    return db.Label.findOne({
      where: {label_name:label_name}
    })
  }

  static create(label_name){
    return db.Label.create({
      label_name:label_name
    })
  }

  static findAll(){
    return db.Label.findAll({attributes:['label_name']})
  }

  static destroy(label_name){
    return db.destroy({
      where :{label_name : label_name}
    })
  }

  static update(label_name,payload){
    return db.Label.update({
      label_name:label_name
    },
    {
      where: {label_name:payload.label_name}
    })
  }

}

//async en js
/*
*/

module.exports = Label