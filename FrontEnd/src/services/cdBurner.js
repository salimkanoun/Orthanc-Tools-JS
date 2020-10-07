import { toastifyError } from './toastify'

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

            return fetch('/api/monitoring/burner/', options).then( (answer) => {
                  if (!answer.ok) { throw answer }
                  return (answer.json())
            }).catch(async error => {
                  let errorText = await error.text()
                  toastifyError(errorText)
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

            return fetch('/api/monitoring/burner/', options).then((answer) => {
                  if (!answer.ok) { throw answer }
                  return (answer.json())
            })

      },

      getCdBuner() {

            let options = {
                  method: 'GET',
                  headers: {
                        Accept: 'application/json'
                  }
            }

            return fetch('/api/monitoring/burner/', options).then((answer) => {
                  if (!answer.ok) { throw answer }
                  return (answer.json())
            }).catch((error) => {
                  toastifyError(error)
            })

      },

      cancelCdBurner(jobBurnerID) {

            let options = {
                  method: 'POST',
                  headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                  },
                  body: JSON.stringify([])
            }

            return fetch('/api/monitoring/burner/jobs/'+jobBurnerID+'/cancel', options).then((answer) => {
                  if (!answer.ok) { throw answer }
                  return (answer.json())
            }).catch((error) => {
                  console.log(error)
                  toastifyError(error)
            })

      }

}


export default cdBurner; 