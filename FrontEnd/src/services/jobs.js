import axios from "axios"

const jobs = {

  getJobs() {

    return axios.get('/api/jobs?expand').then((answer) => {
      if (!answer.ok) { throw answer }
      return answer.json()
    }).catch(error => {
      throw error
    })
  },

  getJobInfos(jobId) {

    return axios.get('/api/jobs/' + jobId).then((answer) => {
      if (!answer.ok) { throw answer }
      return answer.json()
    }).catch(error => {
      throw error
    })

  },

  cancelJob(jobId) {

    return axios.post('/api/jobs/' + jobId + '/cancel', {}).then((answer) => {
      if (!answer.ok) { throw answer }
    })

  },

  pauseJob(jobId) {

    return axios.post('/api/jobs/' + jobId + '/pause', {}).then((answer) => {
      if (!answer.ok) { throw answer }
    })
  },

  resumbitJob(jobId) {

    return axios.post('/api/jobs/' + jobId + '/resubmit', {}).then((answer) => {
      if (!answer.ok) { throw answer }
    })
  },

  resumeJob(jobId) {

    return axios.post('/api/jobs/' + jobId + '/resume', {}).then((answer) => {
      if (!answer.ok) { throw answer }
    })
  },
}

export default jobs
