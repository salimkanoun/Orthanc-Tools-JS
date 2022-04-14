import axios from "./axios"

const options = {

  setRobotScheduleHour(hour_start, min_start, hour_stop, min_stop) {

    return axios.put('/api/options', { hour_start, min_start, hour_stop, min_stop }).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    })
  },

  getOptions() {
    return axios.get('/api/options')
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

    return axios.put('/api/options/orthanc', postData).then((answser) => {
      if (!answser.ok) throw answser
      return true
    })
  },

  getOrthancServer() {
    return axios.get('/api/options/orthanc').then((answer) => answer.json()).catch((error) => { throw error })
  },

  getRedisServer() {

    return axios.get('/api/options/redis').then((answer) => {
      return (answer.json())
    }).catch(error => { throw error })

  },

  getOrthancSystem() {

    return axios.get('/api/system').then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    })
  },

  resetOrthanc() {

    return axios.post('/api/tools/reset').then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    })
  },

  shutdownOrthanc() {

    return axios.post('/api/tools/shutdown').then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    })
  },

  //return current verbosity in Orthanc log
  getVerbosity() {
    return axios.get('/api/tools/log-level').then((response) => response.data).catch((error) => { throw error })
  },

  //set verbosity in Orthanc
  setVerbosity(value) {

    return axios.put('/api/tools/log-level', value).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    })
  },

  getPlugins() {
    return axios.get('/api/plugins').then(response => {
      if (response.ok) {
        return response.json()
      }
      else throw response
    })
  },

  getMode() {
    return axios.get('/api/mode').then(response => {
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

    return axios.put('/api/changeMode', payload).then(response => {
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

    return axios.put('/api/monitoring/burning/options', payload).then(response => {
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

    return axios.put('/api/options/export', payload).then(response => {
      if (response.ok) {
        return true
      } else throw response
    }).catch(error => {
      throw error
    })

  },

  getExportOption() {
    return axios.get('/api/options/export-transcoding').then(response => {
      if (response.ok) {
        return response.text()
      }
      else throw response
    }).catch(error => {
      throw error
    })

  },

  getServerTime() {
    return axios.get('/api/tools/time').then(response => {
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
