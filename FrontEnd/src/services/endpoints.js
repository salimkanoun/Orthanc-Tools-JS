import axios from "axios"

const endpoints = {

  getEndpoints() {
    return axios.get('/api/endpoints')
      .then((answer) => answer.data
      ).catch((error) => {
        throw error
      })
  },

  deleteEndpoints(id) {
    return axios.delete('api/endpoints/', { id: id })
      .then(() => true
      ).catch((error) => {
        throw error
      })
  },

  createEndpoint(postData) {

    return axios.post('api/endpoints/', postData)
      .then(() => true
      ).catch((error) => {
        throw error
      })
  },
}

export default endpoints