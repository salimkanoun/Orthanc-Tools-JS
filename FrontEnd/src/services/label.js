import axios from 'axios'

const label = {
  /**
   * Get all labels
   * @returns {Array.<JSON>}
   */
  getAllLabels() {

    return axios.get('api/labels').then((answer) => answer.data
    ).catch(error => {
      throw error
    })
  },

  /**
   * Create a label
   * @param {String} name label name
   * @returns 
   */
  createLabels(name) {

    return axios.post('/api/labels/' + name).then(() => true
    )
  },

  /**
   * Modify a label
   * @param {String} name label name to modify
   * @param {JSON} payload contains the label to modify
   * @returns 
   */
  modifyLabels(name, payload) {

    return axios.put('/api/labels/' + name, payload).then(() => true
    )
  },

  /**
   * Delete a label
   * @param {String} name label name to delete
   * @returns 
   */
  deleteLabels(name) {

    return axios.delete('/api/labels/' + name).then(() => true
    ).catch(error => {
      throw error
    })
  },
}
export default label