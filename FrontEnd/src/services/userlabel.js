const userlabel = {
  getUsersLabels(){
    const getUsersLabelsOptions={
      method:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    return fetch('/api/userlabels', getUsersLabelsOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
    }).catch(error => {
        throw error
    })
  },

  createUserLabel(payload){
    const createUserLabelOptions={
      method:'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
    }

    return fetch('/api/userlabels', createUserLabelOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
    
  },

  deleteUserLabel(payload){
    const deleteUserLabelOptions={
      method:'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/userlabels', deleteUserLabelOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  }
}
export default userlabel