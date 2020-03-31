import { toastifyError } from './toastify'

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

    }
}

export default jobs

