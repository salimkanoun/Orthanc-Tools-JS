import { toastifyError, toastifySuccess } from './toastify'

const jobs = {

    getJobsID(){
      return fetch('/api/jobs', {
        method: 'GET'
      }).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
      }).catch(error => {
        toastifyError(error)
      })
    },

    getJobInfos(jobId){
        return fetch('/api/jobs/' + jobId, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          }).then((answer) => {
            if (!answer.ok) { throw answer }
            return answer.json()
          }).catch(error => {
            toastifyError(error)
          })

    },

    cancelJob(jobId){
      return fetch('/api/jobs/' + jobId + '/cancel', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({})
      }).then((answer) => {
        if (!answer.ok) { throw answer }
        toastifySuccess('Job Cancelled')
      }).catch(error => {
        toastifyError('error')
      })
      
    }, 

    pauseJob(jobId){
      return fetch('/api/jobs/' + jobId + '/pause', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({})
        }).then((answer) => {
          if (!answer.ok) { throw answer }
          toastifySuccess('Job paused')
        }).catch(error => {
          toastifyError('error')
        })
    }, 

    resumbitJob(jobId){
      return fetch('/api/jobs/' + jobId + '/resubmit', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({})
        }).then((answer) => {
          if (!answer.ok) { throw answer }
          toastifySuccess('Job resubmited')
        }).catch(error => {
          toastifyError('error')
        })
    }, 

    resumeJob(jobId){
      return fetch('/api/jobs/' + jobId + '/resume', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({})
        }).then((answer) => {
          if (!answer.ok) { throw answer }
          toastifySuccess('Job resumed')
        }).catch(error => {
          toastifyError('error')
        })
    }, 
}

export default jobs

