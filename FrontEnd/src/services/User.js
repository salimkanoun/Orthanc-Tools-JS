import axios from "axios"

const user = {
  getUsers() {

    return axios.get('/api/users').then((answer) =>  answer.data
    ).catch(async error => {
      throw error
    })
  },

  modifyUser(username, firstname, lastname, email, role, password, isSuperAdmin) {

    let payload = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      role: role,
      password: password,
      superAdmin: isSuperAdmin
    }

    return axios.put('/api/users/' + username, payload).then(() => {
    }).catch(async error => {
      throw error
    })
  },

  deleteUser(username) {
    return axios.delete('/api/users/' + username).then(() => {
    })
  },

  createUser(username, firstname, lastname, password, email, role, isSuperAdmin) {

    let payload = {
      username: username,
      firstname: firstname,
      lastname: lastname,
      password: password,
      email: email,
      role: role,
      superAdmin: isSuperAdmin
    }

    return axios.post('/api/users', payload).then(() => {
    }).catch(error => {
      throw error
    })
  }
}

export default user