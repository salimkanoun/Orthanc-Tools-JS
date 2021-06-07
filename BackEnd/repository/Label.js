const db = require('../database/models')
const {OTJSDBEntityNotFoundException} = require('../Exceptions/OTJSErrors')

class Label{

  static async getLabel(label_name){
    return db.Label.findOne({
      where: {label_name:label_name}
    })
  }

  static async create(label_name){
    return db.Label.create({
      label_name:label_name
    })
  }

  static async getAllLabel(){
    return db.Label.findAll({attributes:['label_name']})
  }

  static async delete(label_name){
    const label = await Label.getLabel(label_name)
    if(label==null){
      throw new OTJSDBEntityNotFoundException('This label doesn\'t exist')
    }

    return db.Label.destroy({
      where :{label_name : label_name}
    })
  }

  static async update(label_name,new_label_name){
    const label = await Label.getLabel(label_name)
    if(label==null){
      throw new OTJSDBEntityNotFoundException('This label doesn\'t exist')
    }    

    //use bulk update when you need to update primary keys (.save() isn't working)
    //refers to https://github.com/sequelize/sequelize/issues/5827
    return db.Label.update({ 
      label_name:new_label_name
    },
    {
      where : {label_name:label_name}
    })
  }

}

//async en js
/*
*/

module.exports = Label