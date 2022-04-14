import axios from "axios"
import { bindActionCreators } from "redux"

const cdBurner = {

      startCdBurnerService() {

            return axios.post('/api/monitoring/burner/',{}).then((answer) => {
                  if (!answer.ok) { throw answer }
                  return (answer.json())
            }).catch(error => {
                  throw error
            })
      },

      stopCdBurnerService() {

            return axios.delete('/api/monitoring/burner/').then((answer) => {
                  if (!answer.ok) { throw answer }
            }).catch((error) => { throw error })

      },

      getCdBuner() {

            return axios.get('/api/monitoring/burner/').then((answer) => {
                  if (!answer.ok) { throw answer }
                  return (answer.json())
            }).catch((error) => {
                  throw error
            })

      },

      cancelCdBurner(jobBurnerID) {

            return axios.post('/api/monitoring/burner/jobs/' + jobBurnerID + '/cancel', []).then((answer) => {
                  if (!answer.ok) { throw answer }
            }).catch((error) => {
                  throw error
            })

      }

}

export default cdBurner