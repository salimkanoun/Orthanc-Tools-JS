import { toastifySuccess, toastifyError } from './toastify'
import updateOptions from '../authorizedOption'

var optionPlugin = { 
  method: 'GET'
}

var optionOrthancSystem = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}

var optionOrthancServer = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}

const Options = {

  setRobotScheduleHour (hour, min) {

    const setRobotScheduleHourOption = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hour: hour, min: min })
    }

    return fetch('/api/options', updateOptions(setRobotScheduleHourOption) ).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).then(() => {
      toastifySuccess('Done')
    }).catch(error => {
      toastifyError(error.statusText)
    })
  },

  getRobotScheduledHour () {
    return fetch('/api/options', updateOptions() )
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

    const setOrthancServerOption = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    }

    return fetch('/api/options/orthanc-server', updateOptions(setOrthancServerOption) ).then((answser) => {
      if ( ! answser.ok) throw answser
    })
      .then((answer) => toastifySuccess('Updated'))
      .catch((error) => toastifyError('Failure'))
  },

  getOrthancServer () {
    return fetch('/api/options/orthanc-server', updateOptions(optionOrthancServer)).then((answer) => {
      return (answer.json())
    }).then((answer) => { return answer })
    .catch(error =>{ toastifyError('No connexion to BackEnd')})
  },

  getOrthancSystem () {
    return fetch('/api/system', updateOptions(optionOrthancSystem)).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).then((answer) => {
      toastifySuccess('Orthanc Version: ' + answer.Version)
    }).catch((error) => {
      toastifyError('Orthanc Server Error: ' + error.statusText)
    })
  }, 

  resetOrthanc(){

    const resetOrthancOption = {
      method: 'POST'
    } 

    return fetch('/api/tools/reset', updateOptions(resetOrthancOption) ).then((answer) => {
      if (!answer.ok) {throw answer}
      return (answer.json())
    }).catch((error) => {
      toastifyError(error)
    })
  },

  shutdownOrthanc(){

    const shutdownOrthancOption =  {
      method: 'POST'
    }

    return fetch('/api/tools/shutdown', updateOptions(shutdownOrthancOption) ).then((answer) => {
      if (!answer.ok) {throw answer}
      return (answer.json())
    }).catch((error) => {
      toastifyError(error)
    })
  },

  //return current verbosity in Orthanc log
  getVerbosity(){

    const getVerbosityOption = { 
      method: 'GET'
    }

    return fetch('/api/tools/log-level', updateOptions(getVerbosityOption) ).then(response => {
        if (response.ok) {
          return response.text()
        }
        else throw response
      }).catch(error => {
      toastifyError(error.statusText)
    })
  },

  //set verbosity in Orthanc
  setVerbosity(value){

    const setVerbosityOption = {
      method: 'PUT', 
      body: value
    }

    return fetch('/api/tools/log-level', updateOptions(setVerbosityOption) ).then((answer) => {
      if (!answer.ok) {throw answer}
      toastifySuccess("Verbosity have been updated")
    }).catch((error) => {
      toastifyError(error)
    })
  },

  getPlugins(){
    return fetch('/api/plugins',updateOptions(optionPlugin)).then(response => {
        if (response.ok) {
          return response.json()
        }
        else throw response
      }).catch(error => {
      toastifyError(error.statusText)
    })
  },

  getMode() {
    return fetch('/api/mode',updateOptions(optionPlugin)).then(response => {
      if (response.ok) {
        return response.json()
      }
      else throw response
    }).catch(error => {
    toastifyError(error.statusText)
  })
  },

  changeMode(mode) {

    const payload = {
      mode: mode
    }

    const changeModeOption = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/changeMode',updateOptions(changeModeOption)).then(response => {
      if (response.ok) {
        return response.json()
      }
      else throw response
    }).catch(error => {
    toastifyError(error.statusText)
  })
  }

}

export default Options
