import axios from "axios"

const sshKeys = {

  getKeysExpend() {

    return axios.get('/api/keys')
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      })
      .catch((error) => {
        throw (error)
      })
  },

  deleteKey(id) {
    return axios.delete('api/keys/', { id: id })
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return true
      }).catch((error) => {
        throw error
      })
  },

  createKey(label, pass) {

    let postData = {
      label: label,
      pass: pass
    }

    return axios.post('api/keys/', postData)
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      }).catch((error) => {
        throw error
      })
  },

  async uploadKey(id, file) {
    let fileText = await file.text()
    return axios.post('api/keys/upload/' + id, fileText)
      .then((answer) => {
        if (!answer.ok) { throw answer }
      }).catch((error) => {
        throw error
      })
  }
}

export default sshKeys