const studylabel = {
  getStudiesLabels(){
    const getStudiesLabelsOptions={
      method:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    return fetch('/api/studylabels', getStudiesLabelsOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
    }).catch(error => {
        throw error
    })
  },

  createStudyLabel(payload){
    const createStudyLabelOptions={
      method:'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
    }

    return fetch('/api/studylabels', createStudyLabelOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
    
  },

  deleteStudyLabel(payload){
    const deleteStudyLabelOptions={
      method:'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/stuylabels', deleteStudyLabelOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  }

}

export default studylabel