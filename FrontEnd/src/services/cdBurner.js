import axios from "axios"

const cdBurner = {

      startCdBurnerService() {

            return axios.post('/api/monitoring/burner/',{}).then((answer) => answer.data
            ).catch(error => {
                  throw error
            })
      },

      stopCdBurnerService() {

            return axios.delete('/api/monitoring/burner/').then(() => true 
            ).catch((error) => { throw error })

      },

      getCdBuner() {

            return axios.get('/api/monitoring/burner/').then((answer) => answer.data
            ).catch((error) => {
                  throw error
            })

      },

      cancelCdBurner(jobBurnerID) {

            return axios.post('/api/monitoring/burner/jobs/' + jobBurnerID + '/cancel', []).then((answer) => answer)
            .catch((error) => {
                  throw error
            })

      }

}

export default cdBurner