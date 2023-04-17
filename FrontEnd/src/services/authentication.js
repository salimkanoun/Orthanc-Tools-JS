import axios from "axios"

const authentication = {

  logIn(username, password) {

    return axios.post('/api/authentication/', {
      username: username,
      password: password
    })
      .then((answer) => {
        return (answer.data)
      }).catch((error) => { throw error })
  },

  logOut() {

    return axios.delete('/api/authentication/')
      .catch((error) => { console.error(error) })
  }

}

export default authentication