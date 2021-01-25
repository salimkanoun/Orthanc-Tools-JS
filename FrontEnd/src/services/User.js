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

  modifyUser(data) {
    const modifyUserOption = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    return fetch('/api/users', modifyUserOption).then((answer) => {
      if (!answer.ok) { throw answer }
    }).catch(async error => {
      throw error
    })
  },

  deleteUser(username) {
    const deleteUserOption = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([username])
    }

    return fetch('/api/users', deleteUserOption).then((answer) => {
      if (!answer.ok) { throw answer }
    })
  },

  createUser(data) {

    const createUserOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)

    }

    return fetch('/api/users', createUserOption).then((answer) => {
      if (!answer.ok) { throw answer }
    }).catch(error => {
      throw error
    })
  }
}