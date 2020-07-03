import updateOptions from '../authorizedOption'

const retrieve = {

    retrieveByUID (postData) {

      var retrieveByUIDOption =  {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      }

        return fetch('/api/retrieve', updateOptions(retrieveByUIDOption)).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        })
    }
}

export default retrieve;