const sshKeys = {

  getKeysExpend() {
    return fetch('/api/keys')
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      })
      .catch((error) => {
        throw (error)
      })
  },

  deleteKey(id) {
    return fetch('api/keys/', {
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

  createKey(label, pass) {

    let postData = {
      label: label,
      pass: pass
    }

    return fetch('api/keys/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(postData)
    }).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).catch((error) => {
      throw error
    })
  },

  async uploadKey(id, file) {
    let fileText = await file.text()
    return fetch('api/keys/upload/' + id, {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      },
      body: fileText
    }).then((answer) => {
      if (!answer.ok) { throw answer }
    }).catch((error) => {
      throw error
    })
  }
}

export default sshKeys