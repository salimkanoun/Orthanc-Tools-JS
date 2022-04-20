import axios from "axios"

const jobs = {

  getJobs() {

    return axios.get('/api/jobs?expand').then((answer) => answer.data
    ).catch(error => {
      throw error
    })
  },

  getJobInfos(jobId) {

    return axios.get('/api/jobs/' + jobId).then((answer) => answer.data
    ).catch(error => {
      throw error
    })

  },

  cancelJob(jobId) {

    return axios.post('/api/jobs/' + jobId + '/cancel', {}).then((answer) => true )
    .catch(error => {
      throw error
  })

  },

  pauseJob(jobId) {

    return axios.post('/api/jobs/' + jobId + '/pause', {}).then((answer) => true )
    .catch(error => {
      throw error
  })
  },

  resumbitJob(jobId) {

    return axios.post('/api/jobs/' + jobId + '/resubmit', {}).then((answer) => true )
    .catch(error => {
      throw error
  })
  },

  resumeJob(jobId) {

    return axios.post('/api/jobs/' + jobId + '/resume', {}).then((answer) => true ) 
    .catch(error => {
      throw error
  })
  },
}

export default jobs
