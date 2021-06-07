const options = {

  setRobotScheduleHour(hour_start, min_start, hour_stop, min_stop) {

    const setRobotScheduleHourOption = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ hour_start, min_start, hour_stop, min_stop })
    }

    return fetch('/api/options', setRobotScheduleHourOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    })
  },

  getOptions() {
    return fetch('/api/options')
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
      }).catch(error => { throw error })
  },

  setOrthancServer(address, port, username, password) {
    const postData = {
      orthancAddress: address,
      orthancPort: port,
      orthancUsername: username,
      orthancPassword: password
    }

    const setOrthancServerOption = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(postData)
    }

    return fetch('/api/options/orthanc', setOrthancServerOption).then((answser) => {
      if (!answser.ok) throw answser
      return true
    })
  },

  getOrthancServer() {

    let optionOrthancServer = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    return fetch('/api/options/orthanc', optionOrthancServer).then((answer) => {
      return (answer.json())
    }).catch(error => { throw error })
  },

  getRedisServer() {

    let optionRedisServer = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    return fetch('/api/options/redis', optionRedisServer).then((answer) => {
      return (answer.json())
    }).catch(error => { throw error })

  },

  getOrthancSystem() {

    let optionOrthancSystem = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    return fetch('/api/system', optionOrthancSystem).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    })
  },

  resetOrthanc() {

    const resetOrthancOption = {
      method: 'POST'
    }

    return fetch('/api/tools/reset', resetOrthancOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    })
  },

  shutdownOrthanc() {

    const shutdownOrthancOption = {
      method: 'POST'
    }

    return fetch('/api/tools/shutdown', shutdownOrthancOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
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
      throw error
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
      return true
    })
  },

  getPlugins() {
    return fetch('/api/plugins').then(response => {
      if (response.ok) {
        return response.json()
      }
      else throw response
    })
  },

  getMode() {
    return fetch('/api/mode').then(response => {
      if (response.ok) {
        return response.json()
      }
      else throw response
    }).catch(error => {
      throw error
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
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/changeMode', changeModeOption).then(response => {
      if (response.ok) {
        return response.json()
      }
      else throw response
    }).catch(error => {
      throw error
    })
  },

  setBurnerOptions(monitoredPath, viewerPath, labelPath, manufacturer, monitoringLevel, supportType, dateFormat, deleteAfterSend, transferSyntax) {

    let payload = {
      burner_monitored_path: monitoredPath,
      burner_viewer_path: viewerPath,
      burner_label_path: labelPath,
      burner_manifacturer: manufacturer,
      burner_monitoring_level: monitoringLevel,
      burner_support_type: supportType,
      burner_date_format: dateFormat,
      burner_delete_study_after_sent: deleteAfterSend,
      burner_transfer_syntax: transferSyntax

    }

    const burnerOptions = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/monitoring/burning/options', burnerOptions).then(response => {
      if (response.ok) {
        return true
      } else throw response
    }).catch(error => {
      throw error
    })

  },

  setExportOptions(export_transcoding) {

    let payload = {
      export_transcoding
    }

    const exportOptions = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/options/export', exportOptions).then(response => {
      if (response.ok) {
        return true
      } else throw response
    }).catch(error => {
      throw error
    })

  },

  getExportOption() {
    return fetch('/api/options/export-transcoding').then(response => {
      if (response.ok) {
        return response.text()
      }
      else throw response
    }).catch(error => {
      throw error
    })

  },

  getServerTime() {
    return fetch('/api/tools/time').then(response => {
      if (response.ok) {
        return response.text()
      }
      else throw response
    }).catch(error => {
      throw error
    })
  },
}

export default options
