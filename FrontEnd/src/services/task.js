import { toastifyError } from "./toastify"

const task = {

  getTaskProgress(taskId){

    const getJobInfosOption = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

      return fetch('/api/tasks/' + taskId + '/progress' , getJobInfosOption ).then((answer) => {
          if (!answer.ok) { throw answer }
          return answer.json()
        }).catch(error => {
          console.error(error)
        })
        
  },

  getTaskStatus(taskId){

    const getJobInfosOption = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    return fetch('/api/tasks/' + taskId + '/status' , getJobInfosOption ).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
      }).catch(error => {
        console.error(error)
      })
        
  }
}

export default task