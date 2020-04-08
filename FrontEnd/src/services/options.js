import { toastifySuccess, toastifyError } from './toastify'

const Options = {

  setRobotScheduleHour (hour, min) {
    return fetch('/api/options', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hour: hour, min: min })
    }).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).then(() => {
      toastifySuccess('Done')
    }).catch(error => {
      toastifyError(error.statusText)
    })
  },

  getRobotScheduledHour () {
    return fetch('/api/options')
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
      }).catch(error => { toastifyError(error.statusText) })
  },

  setOrthancServer (address, port, username, password) {
    const postData = {
      OrthancAddress: address,
      OrthancPort: port,
      OrthancUsername: username,
      OrthancPassword: password
    }

    return fetch('/api/options/orthanc-server', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    }).then((answser) => {
      if (answser.ok) answser.json()
      else throw answser
    })
      .then((answer) => toastifySuccess('Updated'))
      .catch((error) => toastifyError('Failure'))
  },

  getOrthancServer () {
    return fetch('/api/options/orthanc-server', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((answer) => {
      return (answer.json())
    }).then((answer) => { return answer })
  },

  getOrthancSystem () {
    return fetch('/api/system', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).then((answer) => {
      toastifySuccess('Orthanc Version: ' + answer.Version)
    }).catch((error) => {
      toastifyError('Orthanc Server Error: ' + error.statusText)
    })
  }, 

  resetOrthanc(){
    return fetch('/api/tools/reset', {
      method: 'POST'
    }).then((answer) => {
      if (!answer.ok) {throw answer}
      return (answer.json())
    }).catch((error) => {
      toastifyError(error)
    })
  },

  shutdownOrthanc(){
    return fetch('api/tools/shutdown', {
      method: 'POST'
    }).then((answer) => {
      if (!answer.ok) {throw answer}
      return (answer.json())
    }).catch((error) => {
      toastifyError(error)
    })
  },

  //return current verbosity in Orthanc log
  getVerbosity(){
    return fetch('api/tools/log-level',{ 
      method: 'GET'
    }).then(response => {
        if (response.ok) {
          return response.text()
        }
        else throw response
      }).catch(error => {
      toastifyError(error)
    })
  },

  //set verbosity in Orthanc
  setVerbosity(value){
    return fetch('api/tools/log-level', {
      method: 'PUT', 
      body: value
    }).then((answer) => {
      if (!answer.ok) {throw answer}
      return (answer.json())
    }).catch((error) => {
      toastifyError(error)
    })
  }

}

export default Options
