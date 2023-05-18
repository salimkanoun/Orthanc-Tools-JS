import axios from "axios"

const certificates = {

  getCertificatesExpend() {
    return axios.get('/api/certificates')
      .then((answer) => answer.data
      )
      .catch((error) => {
        throw error
      })
  },

  deleteCertificate(id) {
    return axios.delete('api/certificates/' + id)
      .then(() => true
      ).catch((error) => {
        throw error
      })
  },

  createCertificate(label) {
    return axios.post('api/certificates', { label: label })
      .then((answer) => answer.data
      ).catch((error) => {
        throw error
      })
  },

  async uploadCertificate(id, file) {
    let fileText = await file.text()
    return axios.post('api/certificates/upload/' + id, fileText)
      .then((answer) => answer
      ).catch((error) => {
        throw error
      })
  }
}

export default certificates