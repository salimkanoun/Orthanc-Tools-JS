import axios from "axios"

const endpoints = {

  getEndpoints() {
    return axios.get('/api/endpoints')
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      }).catch((error) => {
        throw error
      })
  },

  deleteEndpoints(id) {
    return axios.delete('api/endpoints/', { id: id })
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return true
      }).catch((error) => {
        throw error
      })
  },

  createEndpoint(postData) {

    return axios.post('api/endpoints/', postData)
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return true
      }).catch((error) => {
        throw error
      })
  },
}

export default endpoints