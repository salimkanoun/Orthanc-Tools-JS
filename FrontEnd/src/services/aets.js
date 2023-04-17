import axios from "axios"

const aets = {

  getAets() {
    return axios.get('/api/modalities').then((answer) => answer.data)
    .catch((error) => {
      throw error
    })
  },

  getAetsExpand() {
    return axios.get('/api/modalities?expand').then((answer) => answer.data)
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

    return axios.put('/api/modalities/' + name, postData).then((answer) => true
    ).catch((error) => {
      throw error
    })

  },

  deleteAet(name) {

    return axios.delete('/api/modalities/' + name).then((answer) => true
    ).catch((error) => {
      throw error
    })

  },

  echoAet(aetName) {

    return axios.post('/api/modalities/' + aetName + '/echo', {}).then( () => true).catch(error => { throw error });

  },

  storeAET(name, orthancIDsArray) {

    return axios.post('/api/modalities/' + name + '/store', {
      Synchronous: false,
      Resources: orthancIDsArray
    }).then((answer) => answer.data).catch(error => {
      throw error
    })
  }
}

export default aets
