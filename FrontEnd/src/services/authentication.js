const authentication = {

    logIn(post){
        return fetch('/api/session/' + post.username, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
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