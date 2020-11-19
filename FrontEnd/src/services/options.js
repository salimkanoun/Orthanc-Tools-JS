import { toastifySuccess, toastifyError } from './toastify'

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

  setRobotScheduleHour(hour_start, min_start, hour_stop, min_stop) {

    const setRobotScheduleHourOption = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({hour_start, min_start, hour_stop, min_stop})
    }

    return fetch('/api/options', setRobotScheduleHourOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).then(() => {
      toastifySuccess('Done')
    }).catch(error => {
      toastifyError(error.statusText)
    })
  },

  getOptions() {
    return fetch('/api/options')
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
      }).catch(error => { toastifyError(error.statusText) })
  },

  setOrthancServer(address, port, username, password) {
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

    return fetch('/api/options/orthanc-server', setOrthancServerOption).then((answser) => {
      if (!answser.ok) throw answser
    })
      .then((answer) => toastifySuccess('Updated'))
      .catch((error) => toastifyError('Failure'))
  },

  getOrthancServer() {
    return fetch('/api/options/orthanc-server', optionOrthancServer).then((answer) => {
      return (answer.json())
    }).then((answer) => { return answer })
      .catch(error => { toastifyError('No connexion to BackEnd') })
  },

  getOrthancSystem() {
    return fetch('/api/system', optionOrthancSystem).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).then((answer) => {
      toastifySuccess('Orthanc Version: ' + answer.Version)
    }).catch((error) => {
      toastifyError('Orthanc Server Error: ' + error.statusText)
    })
  },

  resetOrthanc() {

    const resetOrthancOption = {
      method: 'POST'
    }

    return fetch('/api/tools/reset', resetOrthancOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).catch((error) => {
      toastifyError(error)
    })
  },

  shutdownOrthanc() {

    const shutdownOrthancOption = {
      method: 'POST'
    }

    return fetch('/api/tools/shutdown', shutdownOrthancOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).catch((error) => {
      toastifyError(error)
    })
  },

  //return current verbosity in Orthanc log
  getVerbosity() {

    const getVerbosityOption = {
      method: 'GET'
    }

    return fetch('/api/tools/log-level', getVerbosityOption).then(response => {
      if (response.ok) {
        return response.text()
      }
      else throw response
    }).catch(error => {
      toastifyError(error.statusText)
    })
  },

  //set verbosity in Orthanc
  setVerbosity(value) {

    const setVerbosityOption = {
      method: 'PUT',
      body: value
    }

    return fetch('/api/tools/log-level', setVerbosityOption).then((answer) => {
      if (!answer.ok) { throw answer }
      toastifySuccess("Verbosity have been updated")
    }).catch((error) => {
      toastifyError(error)
    })
  },

  getPlugins() {
    return fetch('/api/plugins', optionPlugin).then(response => {
      if (response.ok) {
        return response.json()
      }
      else throw response
    }).catch(error => {
      toastifyError(error.statusText)
    })
  },

  getMode() {
    return fetch('/api/mode', optionPlugin).then(response => {
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

    return fetch('/api/changeMode', changeModeOption).then(response => {
      if (response.ok) {
        return response.json()
      }
      else throw response
    }).catch(error => {
      toastifyError(error.statusText)
    })
  },

  setBurnerOptions ( formData ){

   const burnerOptions = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  }

   return fetch('/api/monitoring/burning/options', burnerOptions).then(response => {
      if (response.ok) {
        toastifySuccess('Burner Options Updated')
      } else throw response
    }).catch(error => {
      toastifyError(error.statusText)
    })

  }
}

export default Options
