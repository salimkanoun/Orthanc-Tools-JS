const db = require('../database/models')

class StudyLabel{
  static async getStudyLabel(study_instance_uid,label_name){
    return db.StudyLabel.findOne({
      where:{
        study_instance_uid:study_instance_uid,
        label_name:label_name
      }
    })
  }

  static async create(study_instance_uid,label_name){
    return db.StudyLabel.create({
      study_instance_uid:study_instance_uid,
      label_name:label_name
    })
  }

  static async getAllStudyLabel(){
    return db.StudyLabel.findAll()
  }

  static async delete(study_instance_uid,label_name){
    const study_label = await StudyLabel.getStudyLabel(study_instance_uid,label_name)
    if(study_label==null){
      throw new OTJSDBEntityNotFoundException('This StudyLabel doesn\'t exist')
    }

    return db.StudyLabel.destroy({
      where:{
        study_instance_uid:study_instance_uid,
        label_name:label_name
      }
    })
  }
}

module.exports=StudyLabel