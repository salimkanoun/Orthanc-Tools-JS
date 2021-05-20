import { toast } from 'react-toastify'

const label = {
  getAllLabels(){
    const getAllLabelsOptions={
      methode:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    return fetch('api/labels',getAllLabelsOptions).then((answer) => {
      if(!answer.ok) { throw answer }
      return answer.json()
    }).catch(error=>{
      throw error
    })
  },

  createLabels(name){
    const createLabelsOptions = {
      method:'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    }

    return fetch('/api/labels/'+name, createLabelsOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  },

  modifyLabels(name,payload){
    const modifyLabelsOptions = {
      method:'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/labels/'+name, modifyLabelsOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  },

  deleteLabels(name){
    const deleteLabelsOptions = {
      method:'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
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