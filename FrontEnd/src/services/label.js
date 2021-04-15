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

  createLabels(payload){
    const createLabelsOptions = {
      method:'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/labels', createLabelsOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  },

  modifyLabels(payload){
    const modifyLabelsOptions = {
      method:'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/labels', modifyLabelsOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  },

  deleteLabels(payload){
    const deleteLabelsOptions = {
      method:'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/labels', deleteLabelsOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  },
}
export default label