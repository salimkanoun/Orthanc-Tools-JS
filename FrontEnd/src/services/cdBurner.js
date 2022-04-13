import axios from "axios"
import { bindActionCreators } from "redux"

const cdBurner = {

      startCdBurnerService() {
            let options = {
                  method: 'POST',
                  body: JSON.stringify([])
            }

            return axios.post('/api/monitoring/burner/', options).then((answer) => {
                  if (!answer.ok) { throw answer }
                  return (answer.json())
            }).catch(error => {
                  throw error
            })
      },

      stopCdBurnerService() {

            let options = {
                  method: 'DELETE',
            }

            return axios.delete('/api/monitoring/burner/', options).then((answer) => {
                  if (!answer.ok) { throw answer }
            }).catch((error) => { throw error })

      },

      getCdBuner() {

            let options = {
                  method: 'GET',
            }

            return axios.get('/api/monitoring/burner/', options).then((answer) => {
                  if (!answer.ok) { throw answer }
                  return (answer.json())
            }).catch((error) => {
                  throw error
            })

      },

      cancelCdBurner(jobBurnerID) {

            let options = {
                  method: 'POST',
                  body: JSON.stringify([])
            }

            return axios.post('/api/monitoring/burner/jobs/' + jobBurnerID + '/cancel', options).then((answer) => {
                  if (!answer.ok) { throw answer }
            }).catch((error) => {
                  throw error
            })

      }

}

export default cdBurner