const userlabel = {
  getUsersLabels(){
    const getUsersLabelsOptions={
      method:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    return fetch('/api/users/labels', getUsersLabelsOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
    }).catch(error => {
        throw error
    })
  },

  getUserLabels(id){
    const getUserLabelsOptions={
      method:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    return fetch('/api/users/'+id+'/labels', getUserLabelsOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
    }).catch(error => {
        throw error
    })
  },

  createUserLabel(id,name){
    const createUserLabelOptions={
      method:'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    }

    return fetch('/api/users/'+id+'/labels/'+name, createUserLabelOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
    
  },

  deleteUserLabel(id,name){
    const deleteUserLabelOptions={
      method:'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    }

    return fetch('/api/users/'+id+'/labels/'+name, deleteUserLabelOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  }
}
export default userlabel