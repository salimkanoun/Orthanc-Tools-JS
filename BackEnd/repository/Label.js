const db = require('../database/models')
const {OTJSDBEntityNotFoundException} = require('../Exceptions/OTJSErrors')

class Label{

  static async getLabel(labelName){
    return db.Label.findOne({
      where: {label_name:labelName}
    })
  }

  static async create(labelName){
    return db.Label.create({
      label_name:labelName
    })
  }

  static async getAllLabel(){
    return db.Label.findAll({attributes:['label_name']})
  }

  static async delete(labelName){
    const label = await Label.getLabel(labelName)
    if(label==null){
      throw new OTJSDBEntityNotFoundException('This label doesn\'t exist')
    }

    return db.Label.destroy({
      where :{label_name : labelName}
    })
  }

  static async update(labelName,newLabelName){
    const label = await Label.getLabel(labelName)
    if(label==null){
      throw new OTJSDBEntityNotFoundException('This label doesn\'t exist')
    }    

    //use bulk update when you need to update primary keys (.save() isn't working)
    //refers to https://github.com/sequelize/sequelize/issues/5827
    return db.Label.update({ 
      label_name:newLabelName
    },
    {
      where : {label_name:labelName}
    })
  }

}

//async en js
/*
*/

module.exports = Label