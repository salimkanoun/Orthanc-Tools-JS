const StudyLabelRepo = require('../repository/StudyLabel')
const {OTJSConflictException} = require('../Exceptions/OTJSErrors')

class StudyLabel{

  static async createStudyLabel(study_instance_uid,label_name){
    const studylabel =await StudyLabelRepo.getStudyLabel(study_instance_uid,label_name)

    if(studylabel){
      throw new OTJSConflictException('This association studyLabel already exist!');
    }

    return StudyLabelRepo.create(study_instance_uid,label_name)
  }

  static async getAll(){
    return StudyLabelRepo.getAllStudyLabel()
  }

  static  async deleteStudyLabel(study_instance_uid,label_name){
    return StudyLabelRepo.delete(study_instance_uid,label_name)
  }

  static async getStudiesByLabel(label_name){
    return StudyLabelRepo.getStudiesByLabelName(label_name)
  }

  static async getLabelsByStudy(study_instance_uid){
    return StudyLabelRepo.getLabelsbyStudyInstanceUID(study_instance_uid)
  }
}

module.exports=StudyLabel