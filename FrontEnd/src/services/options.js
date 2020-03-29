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
  }

}

export default Options
