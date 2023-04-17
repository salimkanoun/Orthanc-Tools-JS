import axios from "axios"

const task = {

  getTask(taskId) {

    return axios.get('/api/tasks/' + taskId).then((answer) => answer.data
    ).catch(error => {
      throw error
    })

  },

  getTaskOfUser(username, type) {

    return axios.get('/api/tasks/' + username + '/' + type).then((answer) =>  answer.data
    ).catch(error => {
      throw error
    })
  }
}

export default task