import { toastifySuccess, toastifyError } from './toastify'

const aets = {

  getAets () {
    return fetch('/api/modalities')
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      })
      .catch((error) => {
        toastifyError(error)
        return []
      })
  },

  getAetsExpand () {
    return fetch('/api/modalities?expand')
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      })
      .catch((error) => {
        toastifyError(error)
      })
  },

  updateAet (name, parameters) {
    return fetch('/api/modalities/' + name, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parameters)
    }).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    })
      .catch((error) => {
        toastifyError(error)
      })
  },

  deleteAet (name) {
    return fetch('/api/modalities/' + name, {
      method: 'DELETE'
    }).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    })
      .catch((error) => {
        toastifyError(error)
      })
  },

  echoAet (aetName) {
    fetch('/api/modalities/' + aetName + '/echo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }).then(response => {
      if (response.ok) response.json()
      else throw response
    }).then((answer) => {
      toastifySuccess('Echo ' + aetName + ' Sucess')
    }).catch(error => toastifyError('Echo ' + aetName + ' Error'))
  }, 

  storeAET( name, orthancIDsArray){
    return fetch ('/api/modalities/' + name + '/store', {
      method: 'POST', 
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Synchronous : false,
        Resources : orthancIDsArray
        })
      }).then((answer) => {
          if (!answer.ok) {throw answer}
          return (answer.json())
      }).catch(error => {
          toastifyError(error)
    })
  }
}

export default aets
