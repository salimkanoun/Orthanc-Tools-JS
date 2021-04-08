const db = require('../database/models')
const {OTJSConflictException, OTJSBadRequestException} = require('../Exceptions/OTJSErrors')

class StudyLabel{

  static async createStudyLabel(study_instance_uid,label_name){
    const studylabel =await db.StudyLabel.findOne({
      where : {study_instance_uid:study_instance_uid,
      label_name:label_name
    }
    })

    if(studylabel){
      throw new OTJSConflictException('This association studyLabel already exist!');
    }

    return db.StudyLabel.create({
      study_instance_uid:study_instance_uid,
      label_name:label_name
    }).catch((e)=>{throw(e)})
  }

  static async getAll(){
    return db.StudyLabel.findAll().catch((e)=>{throw(e)})
  }

  static  async deleteStudyLabel(study_instance_uid,label_name){
    return db.StudyLabel.destroy({
      where:{study_instance_uid:study_instance_uid,
      label_name:label_name}
    }).catch((e)=>{throw(e)})
  }

}

module.exports=StudyLabel