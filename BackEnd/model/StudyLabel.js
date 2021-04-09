const StudyLabel = require('../repository/StudyLabel')
const {OTJSConflictException} = require('../Exceptions/OTJSErrors')

class StudyLabel{

  static async createStudyLabel(study_instance_uid,label_name){
    const studylabel =await StudyLabel.findOne(study_instance_uid,label_name)

    if(studylabel){
      throw new OTJSConflictException('This association studyLabel already exist!');
    }

    return StudyLabel.create(study_instance_uid,label_name)
  }

  static async getAll(){
    return StudyLabel.findAll()
  }

  static  async deleteStudyLabel(study_instance_uid,label_name){
    return StudyLabel.destroy(study_instance_uid,label_name)
  }

}

module.exports=StudyLabel