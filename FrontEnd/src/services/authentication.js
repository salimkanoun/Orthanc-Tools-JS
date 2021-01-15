export default {

  logIn(username, password) {
    return fetch('/api/login/' + username, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).catch((error) => { throw error })
  },

  logOut() {
    return fetch('/api/login/', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    }).catch((error) => { console.error(error) })
  }
  
}