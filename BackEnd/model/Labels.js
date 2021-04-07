const { sequelize } = require('../database/models');
const db = require('../database/models')
const {OTJSConflictException, OTJSBadRequestException} = require('../Exceptions/OTJSErrors')

class Labels{

  static async createLabels(label_name){

    const labels = await db.Label.findOne({
      where: { label_name:Label.label_name} 
    })

    if(labels){
      throw new OTJSConflictException('This labels already exist');
    }

    return db.Label.create({
      label_name: label_name
    }).catch( (e) => {throw e})
  }

  static async getAllLabels(){
    return db.Label.findAll({attributes: ['label_name']}).catch((e)=>{throw(e)})
  }

  static async deleteLabels(label_name){
    //delete en cascade dans user_label et study_label
    return db.Label.destroy({
      where :{label_name : label_name}
    }).catch((e)=>{throw(e)})
  }

  static async modifyLabels(label_name,payload){
    //modify en cascade dans user_label et study_label
      return db.Label.update(
        {
          label_name:label_name
        }
        ,
        {
          where: {label_name:payload.label_name}
        }
      ).catch((error) => { throw error })
  }

}

module.exports = Labels