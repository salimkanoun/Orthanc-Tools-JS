import axios from "axios"

const studylabel = {

  addLabelToOrthancStudy(studyOrthancId, labelName) {
    return axios.put('/api/studies/' + studyOrthancId + '/labels/' + labelName).then((answer) =>
      answer.data
    ).catch(error => {
      throw error
    })
  },

  removeLabelToOrthancStudy(studyOrthancId, labelName) {
    return axios.delete('/api/studies/' + studyOrthancId + '/labels/' + labelName).then((answer) =>
      answer.data
    ).catch(error => {
      throw error
    })
  },

  /**
 * Get all the labels associate to a study
 */
  getOrthancStudyLabels(studyOrthancId) {
    return axios.get('/api/studies/' + studyOrthancId + '/labels').then((answer) => answer.data
    ).catch(error => {
      throw error
    })
  },

  /**
   * Get all the studies associate to one or multiple label
   * @param {array} labels name of the labels
   * @param {string} constraint All or Any
   * @returns {Array.<JSON>}
   */
  getStudiesWithLabels(labels, constraint) {
    const payload = {
      Level: "Study",
      Labels: labels,
      LabelsConstraint: constraint,
      Query: {}
    }
    return axios.get('/api/tools/find', payload).then((answer) => answer.data
    ).catch(error => {
      throw error
    })
  },

}

export default studylabel