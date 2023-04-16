const StudyLabelRepo = require('../repository/StudyLabel')
const { OTJSConflictException } = require('../Exceptions/OTJSErrors')

class StudyLabel {
  /**
   * Create a StudyLabel
   * @param {String} study_instance_uid instance_uid of the study
   * @param {String} labelName name of the label
   * @param {String} patient_id id of the patient linked to the study
   * @param {String} study_orthanc_id orthanc id of the study
   * @param {String} patient_orthanc_id orthanc id of the patient
   * @returns 
   */
  static async createStudyLabel(study_instance_uid, labelName, patient_id, study_orthanc_id, patient_orthanc_id) {
    const studylabel = await StudyLabelRepo.getStudyLabel(study_instance_uid, labelName)

    if (studylabel) {
      throw new OTJSConflictException('This association studyLabel already exist!');
    }

    return StudyLabelRepo.create(study_instance_uid, labelName, patient_id, study_orthanc_id, patient_orthanc_id)
  }

  /**
   * Get all StudyLabels
   * @returns 
   */
  static async getAll() {
    return StudyLabelRepo.getAllStudyLabel()
  }

  /**
   * Delete a StudyLabel
   * @param {String} study_instance_uid instance_uid of the study
   * @param {String} labelName name of the label
   * @returns 
   */
  static async deleteStudyLabel(study_instance_uid, labelName) {
    return StudyLabelRepo.delete(study_instance_uid, labelName)
  }

  /**
   * Get all the studies linked to one label
   * @param {String} labelName name of the label
   * @returns 
   */
  static async getStudiesByLabel(labelName) {
    return StudyLabelRepo.getStudiesByLabelName(labelName)
  }

  /**
   * Get all the labels linked to one study
   * @param {String} study_instance_uid instance_uid of the study
   * @returns 
   */
  static async getLabelsByStudy(study_instance_uid) {
    return StudyLabelRepo.getLabelsbyStudyInstanceUID(study_instance_uid)
  }

  /**
   * Get StudyLabels using an orthanc id from a study
   * @param {String} study_orthanc_id orhtanc id of the study
   * @returns 
   */
  static async getStudyLabelsByStudyOrthancID(study_orthanc_id) {
    return StudyLabelRepo.getStudyLabelsByStudyOrthancID(study_orthanc_id)
  }
}

module.exports = StudyLabel