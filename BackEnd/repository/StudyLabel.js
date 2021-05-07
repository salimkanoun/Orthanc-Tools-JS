const db = require('../database/models')
const {OTJSDBEntityNotFoundException} = require('../Exceptions/OTJSErrors')

class StudyLabel{
  static async getStudyLabel(study_instance_uid,label_name){
    return db.StudyLabel.findOne({
      where:{
        study_instance_uid:study_instance_uid,
        label_name:label_name
      }
    })
  }

  static async create(study_instance_uid,label_name,patient_id){
    return db.StudyLabel.create({
      study_instance_uid:study_instance_uid,
      label_name:label_name,
      patient_id:patient_id
    })
  }

  static async getAllStudyLabel(){
    return db.StudyLabel.findAll()
  }
  
  static async getStudiesByLabelName(label_name){
    return db.StudyLabel.findAll({
      where:{
        label_name:label_name
      },attributes:['study_instance_uid','patient_id']
    })
  }

  static async getLabelsbyStudyInstanceUID(study_instance_uid){
    return db.StudyLabel.findAll({
      where:{
        study_instance_uid:study_instance_uid
      },attributes:['label_name']
    })
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