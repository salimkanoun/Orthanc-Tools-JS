const authentication = {

    sendAuthentication(post){

        return fetch('/api/authentication', {
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

    }
}

export default authentication; 