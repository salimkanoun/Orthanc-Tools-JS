import { toastifyError, toastifySuccess } from './toastify'

const jobs = {

    getJobs(){

      const getJobsOption = {
        method: 'GET'
      }

      return fetch('/api/jobs?expand', getJobsOption ).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
      }).catch(error => {
        toastifyError(error)
      })
    },

    getJobInfos(jobId){

      const getJobInfosOption = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }

        return fetch('/api/jobs/' + jobId, getJobInfosOption ).then((answer) => {
            if (!answer.ok) { throw answer }
            return answer.json()
          }).catch(error => {
            toastifyError(error)
          })

    },

    cancelJob(jobId){

      const cancelJobOption = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({})
      }

      return fetch('/api/jobs/' + jobId + '/cancel', cancelJobOption ).then((answer) => {
        if (!answer.ok) { throw answer }
        toastifySuccess('Job Cancelled')
      }).catch(error => {
        toastifyError('error')
      })
      
    }, 

    pauseJob(jobId){

      const pauseJobOption = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({})
      }

      return fetch('/api/jobs/' + jobId + '/pause', pauseJobOption ).then((answer) => {
          if (!answer.ok) { throw answer }
          toastifySuccess('Job paused')
        }).catch(error => {
          toastifyError('error')
        })
    }, 

    resumbitJob(jobId){

      const resumbitJobOption = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({})
      }

      return fetch('/api/jobs/' + jobId + '/resubmit', resumbitJobOption ).then((answer) => {
          if (!answer.ok) { throw answer }
          toastifySuccess('Job resubmited')
        }).catch(error => {
          toastifyError('error')
        })
    }, 

    resumeJob(jobId){

      const resumeJobOption = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({})
      } 

      return fetch('/api/jobs/' + jobId + '/resume', resumeJobOption ).then((answer) => {
          if (!answer.ok) { throw answer }
          toastifySuccess('Job resumed')
        }).catch(error => {
          toastifyError('error')
        })
    }, 
}

export default jobs

