import { toastifyError } from "./toastify"

const exportTask = {

    getTaskInfos(taskId){

      const getJobInfosOption = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }

        return fetch('/api/export/' + taskId + '/progress' , getJobInfosOption ).then((answer) => {
            if (!answer.ok) { throw answer }
            return answer.json()
          }).catch(error => {
            toastifyError(error)
          })
          
    }
}

export default exportTask