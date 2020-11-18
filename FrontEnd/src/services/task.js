const task = {

  getTask(taskId){

    const getJobInfosOption = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    return fetch('/api/tasks/' + taskId , getJobInfosOption ).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
      }).catch(error => {
        console.error(error)
      })
        
  },

  getTaskOfUser(username,type){
    const getJobInfosOption = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    return fetch('/api/tasks/' + username + '/' + type, getJobInfosOption ).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
      }).catch(error => {
        console.error(error)
      })
  }
}

export default task