import axios from "axios"

const autorouter = {
      /**
       * Start the Dicom Router
       * @returns 
       */
      startAutorouterService(){

      return axios.post('/api/monitoring/autorouter', {}).then(() => true
      ).catch(error => {
            throw error
            })

      },

      /**
       * Stop the dicom router
       * @returns 
       */
      stopAutorouterService(){
      
      return axios.delete('/api/monitoring/autorouter').then(() =>  true
      ).catch(error => {
            throw error
            })
      },

      /**
       * get the info about the Dicom router
       * @returns 
       */
  getAutorouter(){ 
    return axios.get('/api/monitoring/autorouter').then((answer) => answer.data
    ).catch((error) => {
        throw error
    })
  },

}

export default autorouter