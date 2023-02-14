import axios from "./axios"

const options = {

  setRobotScheduleHour(hour_start, min_start, hour_stop, min_stop) {

    return axios.put('/api/options', { hour_start, min_start, hour_stop, min_stop }).then((answer) => 
      true
    )
  },

  getOptions() {
    return axios.get('/api/options')
      .then((answer) => {
        return answer.data
      }).catch(error => { throw error })
  },

  setOrthancServer(address, port, username, password) {
    const postData = {
      orthancAddress: address,
      orthancPort: port,
      orthancUsername: username,
      orthancPassword: password
    }

    return axios.put('/api/options/orthanc', postData).then((answser) => 
      true
    )
  },

  getOrthancServer() {
    return axios.get('/api/options/orthanc').then((answer) => answer.data).catch((error) => { console.log(error) ; throw error })
  },

  getRedisServer() {

    return axios.get('/api/options/redis').then((answer) => answer.data
    ).catch(error => { throw error })

  },

  getOrthancSystem() {

    return axios.get('/api/system').then((answer) => answer.data
    ).catch((error) => { throw error})
  },

  resetOrthanc() {

    return axios.post('/api/tools/reset').then((answer) => answer.data
    ).catch((error) => { throw error})
  },

  shutdownOrthanc() {

    return axios.post('/api/tools/shutdown').then((answer) => answer.data
    ).catch((error) => { throw error})
  },

  //return current verbosity in Orthanc log
  getVerbosity() {
    return axios.get('/api/tools/log-level').then((response) => response.data
    ).catch((error) => { throw error })
  },

  //set verbosity in Orthanc
  setVerbosity(value) {
    return axios.put('/api/tools/log-level', value, {headers : {'Content-Type' : 'text/plain'}}).then((answer) => true
    ).catch(error => {
      throw error
  })
  },

  getPlugins() {
    return axios.get('/api/plugins').then(response =>  response.data
    ).catch(error => {
      throw error
    })
  },

  getMode() {
    return axios.get('/api/mode').then(response => response.data
    ).catch(error => {
      throw error
    })
  },

  changeMode(mode) {

    const payload = {
      mode: mode
    }

    return axios.put('/api/changeMode', payload).then(response =>  response.data
    ).catch(error => {
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

    return axios.put('/api/monitoring/burning/options', payload).then(response => true
    ).catch(error => {
      throw error
    })

  },

  setExportOptions(export_transcoding) {

    let payload = {
      export_transcoding
    }

    return axios.put('/api/options/export', payload).then(response => true
    ).catch(error => {
      throw error
    })

  },

  getExportOption() {
    return axios.get('/api/options/export-transcoding').then(response => response.data
    ).catch(error => {
      throw error
    })

  },

  getServerTime() {
    return axios.get('/api/tools/time').then(response => response.data
    ).catch(error => {
      throw error
    })
  },
}

export default options
