const db = require('../database/models')

class StudyLabel{
  static findOne(study_instance_uid,label_name){
    return db.StudyLabel.findOne({
      where:{
        study_instance_uid:study_instance_uid,
        label_name:label_name
      }
    })
  }

  static create(study_instance_uid,label_name){
    return db.StudyLabel.create({
      study_instance_uid:study_instance_uid,
      label_name:label_name
    })
  }

  static findAll(){
    return db.StudyLabel.findAll()
  }

  static destroy(study_instance_uid,label_name){
    return db.StudyLabel.destroy({
      where:{
        study_instance_uid:study_instance_uid,
        label_name:label_name
      }
    })
  }
}

module.exports=StudyLabel