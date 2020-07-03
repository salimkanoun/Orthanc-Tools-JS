import { toastifySuccess, toastifyError } from './toastify'
import updateOptions from '../authorizedOption'


const aets = {

  getAets () {
    return fetch('/api/modalities', updateOptions())
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
    return fetch('/api/modalities?expand', updateOptions())
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      })
      .catch((error) => {
        toastifyError(error)
      })
  },

  updateAet (name, parameters) {

    const updateAetOption =  {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parameters)
    } 

    return fetch('/api/modalities/' + name, updateOptions(updateAetOption)).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    })
      .catch((error) => {
        toastifyError(error)
      })
  },

  deleteAet (name) {

    const deleteAetOption = {
      method: 'DELETE'
    }

    return fetch('/api/modalities/' + name, updateOptions(deleteAetOption) ).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    })
      .catch((error) => {
        toastifyError(error)
      })
  },

  echoAet (aetName) {

    const echoAetOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }

    fetch('/api/modalities/' + aetName + '/echo', updateOptions(echoAetOption) ).then(response => {
      if (response.ok) response.json()
      else throw response
    }).then((answer) => {
      toastifySuccess('Echo ' + aetName + ' Sucess')
    }).catch(error => toastifyError('Echo ' + aetName + ' Error'))
  }, 

  storeAET( name, orthancIDsArray){

    const storeAETOption = {
      method: 'POST', 
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Synchronous : false,
        Resources : orthancIDsArray
        })
      }

    return fetch ('/api/modalities/' + name + '/store', updateOptions(storeAETOption)).then((answer) => {
          if (!answer.ok) {throw answer}
          return (answer.json())
      }).catch(error => {
          toastifyError(error)
    })
  }
}

export default aets
