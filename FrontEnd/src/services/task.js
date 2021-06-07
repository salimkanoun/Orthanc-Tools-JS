const task = {

  getTask(taskId) {

    const getJobInfosOption = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    return fetch('/api/tasks/' + taskId, getJobInfosOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return answer.json()
    }).catch(error => {
      throw error
    })

  },

  getTaskOfUser(username, type) {
    const getJobInfosOption = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    return fetch('/api/tasks/' + username + '/' + type, getJobInfosOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return answer.json()
    }).catch(error => {
      throw error
    })
  }
}

export default task