export default {
  getUsers() {

    const getUsersOption = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    return fetch('/api/users', getUsersOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return answer.json()
    }).catch(async error => {
      throw error
    })
  },

  modifyUser(id, username, firstname, lastname, email, role, password, isSuperAdmin) {

    let payload = {
      username : username,
      firstname : firstname,
      lastname : lastname,
      email : email,
      role : role,
      password : password,
      superAdmin : isSuperAdmin
    }

    const modifyUserOption = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/users/'+id, modifyUserOption).then((answer) => {
      if (!answer.ok) { throw answer }
    }).catch(async error => {
      throw error
    })
  },

  deleteUser(id) {

    const deleteUserOption = {
      method: 'DELETE'
    }

    return fetch('/api/users/'+id, deleteUserOption).then((answer) => {
      if (!answer.ok) { throw answer }
    })
  },

  createUser(username, firstname, lastname, password, email, role, isSuperAdmin) {

    let payload = {
      username : username,
      firstname : firstname,
      lastname : lastname,
      password : password,
      email : email,
      role : role,
      superAdmin : isSuperAdmin
    }

    console.log(payload)

    const createUserOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/users', createUserOption).then((answer) => {
      if (!answer.ok) { throw answer }
    }).catch(error => {
      throw error
    })
  }
}