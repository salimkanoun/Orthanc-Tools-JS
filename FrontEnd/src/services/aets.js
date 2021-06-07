const aets = {

  getAets() {
    return fetch('/api/modalities')
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      })
      .catch((error) => {
        throw error
      })
  },

  getAetsExpand() {
    return fetch('/api/modalities?expand')
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      })
      .catch((error) => {
        throw error
      })
  },

  updateAet(name, aetName, host, port, manufacturer) {

    let postData = {
      AET: aetName,
      Host: host,
      Port: port,
      Manufacturer: manufacturer
    }

    const updateAetOption = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(postData)
    }

    return fetch('/api/modalities/' + name, updateAetOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    }).catch((error) => {
      throw error
    })

  },

  deleteAet(name) {

    const deleteAetOption = {
      method: 'DELETE'
    }

    return fetch('/api/modalities/' + name, deleteAetOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    }).catch((error) => {
      throw error
    })

  },

  echoAet(aetName) {

    const echoAetOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({})
    }

    return fetch('/api/modalities/' + aetName + '/echo', echoAetOption).then(response => {
      if (response.ok) return true
      else throw response
    }).catch(error => { throw error });

  },

  storeAET(name, orthancIDsArray) {

    const storeAETOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        Synchronous: false,
        Resources: orthancIDsArray
      })
    }

    return fetch('/api/modalities/' + name + '/store', storeAETOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).catch(error => {
      throw error
    })
  }
}

export default aets
