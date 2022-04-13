import axios from "axios"

const autorouter = {
      /**
       * Start the Dicom Router
       * @returns 
       */
      startAutorouterService(){
      const startAutorouterServiceOptions={
            method:'POST',
            body:JSON.stringify({})
      }

      return axios.post('/api/monitoring/autorouter', startAutorouterServiceOptions).then((answer) => {
            if (!answer.ok) { throw answer }
            return true
      }).catch(error => {
            throw error
            })

      },

      /**
       * Stop the dicom router
       * @returns 
       */
      stopAutorouterService(){
      const stopAutorouterServiceOptions={
            method:'DELETE',
      }

      return axios.delete('/api/monitoring/autorouter', stopAutorouterServiceOptions).then((answer) => {
            if (!answer.ok) { throw answer }
            return true
      }).catch(error => {
            throw error
            })
      },

      /**
       * get the info about the Dicom router
       * @returns 
       */
  getAutorouter(){ 
    const getAutorouterOptions={
      method:'GET',
    }
    return axios.get('/api/monitoring/autorouter', getAutorouterOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
    }).catch(error => {
        throw error
    })
  },

}

export default autorouter