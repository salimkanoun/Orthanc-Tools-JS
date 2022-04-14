import axios from 'axios'
import { toast } from 'react-toastify'

const label = {
  /**
   * Get all labels
   * @returns {Array.<JSON>}
   */
  getAllLabels() {

    return axios.get('api/labels').then((answer) => {
      if (!answer.ok) { throw answer }
      return answer.json()
    }).catch(error => {
      throw error
    })
  },

  /**
   * Create a label
   * @param {String} name label name
   * @returns 
   */
  createLabels(name) {

    return axios.post('/api/labels/' + name).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    })
  },

  /**
   * Modify a label
   * @param {String} name label name to modify
   * @param {JSON} payload contains the label to modify
   * @returns 
   */
  modifyLabels(name, payload) {

    return axios.put('/api/labels/' + name, payload).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    })
  },

  /**
   * Delete a label
   * @param {String} name label name to delete
   * @returns 
   */
  deleteLabels(name) {

    return axios.delete('/api/labels/' + name).then((answer) => {
      if (!answer.ok) {
        toast.error('Remove all Studies/Roles - Labels association !')
        throw answer
      }
      return true
    })
  },
}
export default label