import axios from "axios"

const task = {

  getTask(taskId) {

    return axios.get('/api/tasks/' + taskId).then((answer) => {
      if (!answer.ok) { throw answer }
      return answer.json()
    }).catch(error => {
      throw error
    })

  },

  getTaskOfUser(username, type) {

    return axios.get('/api/tasks/' + username + '/' + type).then((answer) => {
      if (!answer.ok) { throw answer }
      return answer.json()
    }).catch(error => {
      throw error
    })
  }
}

export default task