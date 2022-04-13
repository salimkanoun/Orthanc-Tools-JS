import axios from "axios"

const authentication = {

  logIn(username, password) {
    return fetch('/api/authentication/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then( (answer) => {
      return (answer.text())
    }).catch((error) => { throw error })
  },

  logOut() {
    return fetch('/api/authentication/', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
    }).catch((error) => { console.error(error) })
  }
  
}

export default authentication