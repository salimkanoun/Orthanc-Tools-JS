const jobs = {

  getJobs() {

    const getJobsOption = {
      method: 'GET'
    }

    return fetch('/api/jobs?expand', getJobsOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return answer.json()
    }).catch(error => {
      throw error
    })
  },

  getJobInfos(jobId) {

    const getJobInfosOption = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    return fetch('/api/jobs/' + jobId, getJobInfosOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return answer.json()
    }).catch(error => {
      throw error
    })

  },

  cancelJob(jobId) {

    const cancelJobOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({})
    }

    return fetch('/api/jobs/' + jobId + '/cancel', cancelJobOption).then((answer) => {
      if (!answer.ok) { throw answer }
    })

  },

  pauseJob(jobId) {

    const pauseJobOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({})
    }

    return fetch('/api/jobs/' + jobId + '/pause', pauseJobOption).then((answer) => {
      if (!answer.ok) { throw answer }
    })
  },

  resumbitJob(jobId) {

    const resumbitJobOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({})
    }

    return fetch('/api/jobs/' + jobId + '/resubmit', resumbitJobOption).then((answer) => {
      if (!answer.ok) { throw answer }
    })
  },

  resumeJob(jobId) {

    const resumeJobOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({})
    }

    return fetch('/api/jobs/' + jobId + '/resume', resumeJobOption).then((answer) => {
      if (!answer.ok) { throw answer }
    })
  },
}

export default jobs
