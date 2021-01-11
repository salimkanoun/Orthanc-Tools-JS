const authentication = {

    logIn(username, password){
        return fetch('/api/session/' + username, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username : username,
              password : password
            })
          }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          })
    },

    logOut(){
      return fetch('/api/session/', {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      }).then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      })
    }
}

export default authentication; 