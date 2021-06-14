const autorouter = {
      /**
       * Start the Dicom Router
       * @returns 
       */
      startAutorouterService(){
      const startAutorouterServiceOptions={
            method:'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
            },
            body:JSON.stringify({})
      }

      return fetch('/api/monitoring/autorouter', startAutorouterServiceOptions).then((answer) => {
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
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
            },
      }

      return fetch('/api/monitoring/autorouter', stopAutorouterServiceOptions).then((answer) => {
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
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    return fetch('/api/monitoring/autorouter', getAutorouterOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return answer.json()
    }).catch(error => {
        throw error
    })
  },

}

export default autorouter