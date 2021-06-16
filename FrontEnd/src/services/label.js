import { toast } from 'react-toastify'

const label = {
  /**
   * Get all labels
   * @returns {Array.<JSON>}
   */
  getAllLabels(){
    const getAllLabelsOptions={
      methode:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    return fetch('api/labels',getAllLabelsOptions).then((answer) => {
      if(!answer.ok) { throw answer }
      return answer.json()
    }).catch(error=>{
      throw error
    })
  },

  /**
   * Create a label
   * @param {String} name label name
   * @returns 
   */
  createLabels(name){
    const createLabelsOptions = {
      method:'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
    }

    return fetch('/api/labels/'+name, createLabelsOptions).then((answer) => {
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
  modifyLabels(name,payload){
    const modifyLabelsOptions = {
      method:'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/labels/'+name, modifyLabelsOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  },

  /**
   * Delete a label
   * @param {String} name label name to delete
   * @returns 
   */
  deleteLabels(name){
    const deleteLabelsOptions = {
      method:'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
    }

    return fetch('/api/labels/'+name, deleteLabelsOptions).then((answer) => {
        if (!answer.ok) { 
          toast.error('Remove all Studies/Roles - Labels association !')
          throw answer
         }
        return true
    })
  },
}
export default label