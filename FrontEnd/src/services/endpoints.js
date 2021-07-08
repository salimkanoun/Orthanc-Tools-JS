const endpoints =  {

  getEndpoints() {
    return fetch('/api/endpoints')
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      }).catch((error) => {
        throw error
      })
  },

  deleteEndpoints(id) {
    return fetch('api/endpoints/', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ id: id })
    }).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    }).catch((error) => {
      throw error
    })
  },

  createEndpoint(postData) {

    return fetch('api/endpoints/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(postData)
    }).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    }).catch((error) => {
      throw error
    })
  },
}

export default endpoints