const certificates = {

  getCertificatesExpend() {
    return fetch('/api/certificates')
      .then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      })
      .catch((error) => {
        throw error
      })
  },

  deleteCertificate(id) {
    return fetch('api/certificates/' + id, {
      method: 'DELETE'
    }).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    }).catch((error) => {
      throw error
    })
  },

  createCertificate(label) {
    return fetch('api/certificates', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({label : label})
    }).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.text())
    }).catch((error) => {
      throw error
    })
  },

  async uploadCertificate(id, file) {
    let fileText = await file.text()
    return fetch('api/certificates/upload/' + id, {
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

export default certificates