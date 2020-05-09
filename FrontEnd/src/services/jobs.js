import { toastifyError, toastifySuccess } from './toastify'

const jobs = {
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

      return fetch('/api/jobs/' + jobId, + '/cancel', {
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
        toastifyError(error)
      })
      
    }
}

export default jobs

