import axios from "axios"

const studylabel = {
  /**
   * Get all StudyLabels
   * @returns 
   */
  getStudiesLabels() { //get ALL

    return axios.get('/api/studies/labels').then((answer) => 
      answer.data
    ).catch(error => {
      throw error
    })
  },

  /**
   * Get all the studies associate to a label
   * @param {String} name name of the label
   * @returns {Array.<JSON>}
   */
  getStudiesLabel(name) { //get Studies for one particular Label

    return axios.get('/api/studies/labels/' + name).then((answer) => answer.data
    ).catch(error => {
      throw error
    })
  },

  /**
   * Get all the labels associate to a study
   * @param {String} study_instance_uid instance uid of the study
   * @returns {Array.<JSON>}
   */
  getStudyLabels(study_instance_uid) { //get Labels for one particular study

    return axios.get('/api/studies/' + study_instance_uid + '/labels').then((answer) => answer.data
    ).catch(error => {
      throw error
    })
  },

  /**
   * get all the StudyLabels associate to a Study Orthanc ID
   * @param {String} study_orthanc_id study orthanc id to search for
   * @returns {Array.<JSON>}
   */
  getStudyLabelsByStudyOrthancID(study_orthanc_id) {

    return axios.get('/api/studies/orthanc/' + study_orthanc_id + '/labels').then((answer) => answer.data
    ).catch(error => {
      throw error
    })
  },

  /**
   * Create a Studylabel
   * @param {String} study_instance_uid instance_uid of the study
   * @param {String} label_name name of the label
   * @param {String} patient_id id of patient
   * @param {String} study_orthanc_id orthanc_id associate to the study
   * @param {String} patient_orthanc_id orthanc_id associate to the patient
   * @returns 
   */
  createStudyLabel(study_instance_uid, label_name, patient_id, study_orthanc_id, patient_orthanc_id) {

    return axios.post('/api/patient/' + patient_id + '/studies/' + study_instance_uid + '/labels/' + label_name, {
      study_orthanc_id: study_orthanc_id,
      patient_orthanc_id: patient_orthanc_id
    }).then((answer) => true
    ).catch(error => {
      throw error
  })

  },

  /**
   * Delete a StudyLabel
   * @param {String} study_instance_uid instance_uid of the study
   * @param {String} name name of the label
   * @returns 
   */
  deleteStudyLabel(study_instance_uid, name) {

    return axios.delete('/api/studies/' + study_instance_uid + '/labels/' + name).then((answer) => true
    ).catch(error => {
      throw error
  })
  }

}

export default studylabel