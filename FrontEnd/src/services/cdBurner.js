import { toastifyError } from './toastify'
import updateOptions from '../authorizedOption'

const cdBurner = {

    startCdBurnerService() {
        let options = {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify([])
         }

         return fetch('/api/monitoring/burner/', updateOptions(options) ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch((error) => {
                console.log(error)
                toastifyError(error)
          })

    },

    stopCdBurnerService() {
        let options = {
            method: 'DELETE',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            }
         }

         return fetch('/api/monitoring/burner/', updateOptions(options) ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch((error) => {
                console.log(error)
                toastifyError(error)
          })

    },

    getCdBuner(){

        let options = {
            method: 'GET',
            headers: {
            Accept: 'application/json'
            }
         }

         return fetch('/api/monitoring/burner/', updateOptions(options) ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch((error) => {
                toastifyError(error)
          })

    }

}


export default cdBurner; 