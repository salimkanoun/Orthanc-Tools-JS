const studylabel = {
  getStudiesLabels(){ //get ALL
    const getStudiesLabelsOptions={
      method:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    return fetch('/api/studies/labels', getStudiesLabelsOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
    }).catch(error => {
        throw error
    })
  },

  getStudiesLabel(name){ //get Studies for one particular Label
    const getStudiesLabelOptions={
      method:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    return fetch('/api/studies/labels/'+name, getStudiesLabelOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
    }).catch(error => {
        throw error
    })
  },

  getStudyLabels(study_instance_uid){ //get Labels for one particular study
    const getStudyLabelsOptions={
      method:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    return fetch('/api/studies/'+study_instance_uid+'/labels', getStudyLabelsOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
    }).catch(error => {
        throw error
    })
  },

  createStudyLabel(study_instance_uid,name){
    const createStudyLabelOptions={
      method:'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    }

    return fetch('/api/studies/'+study_instance_uid+'/labels/'+name, createStudyLabelOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
    
  },

  deleteStudyLabel(study_instance_uid,name){
    const deleteStudyLabelOptions={
      method:'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    }

    return fetch('/api/studies/'+study_instance_uid+'/labels/'+name, deleteStudyLabelOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  }

}

export default studylabel