const db = require('../database/models')
const {OTJSConflictException, OTJSBadRequestException} = require('../Exceptions/OTJSErrors')

class Study_Label{

  static async createStudyLabel(study_uid,label_name){
    const study_label =await db.Study_Label.findOne({
      where : {study_uid:study_uid,
      label_name:label_name
    }
    })

    if(study_label){
      throw new OTJSConflictException('This association study_label already exist!');
    }

    return db.Study_Label.create({
      study_uid:study_uid,
      label_name:label_name
    }).catch((e)=>{throw(e)})
  }

  static async getAll(){
    return db.Study_Label.findAll().catch((e)=>{throw(e)})
  }

  static  async deleteStudyLabel(study_uid,label_name){
    return db.Study_Label.destroy({
      where:{study_uid:study_uid,
      label_name:label_name}
    }).catch((e)=>{throw(e)})
  }

}

module.exports=Study_Label