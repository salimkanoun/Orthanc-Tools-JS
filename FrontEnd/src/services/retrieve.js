const retrieve = {

    retrieveByUID (postData) {

        return fetch('/api/retrieve', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)

        }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        })

    }

}

export default retrieve;