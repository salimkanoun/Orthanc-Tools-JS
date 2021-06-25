const cdBurner = {

      startCdBurnerService() {
            let options = {
                  method: 'POST',
                  headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                  },
                  body: JSON.stringify([])
            }

            return fetch('/api/monitoring/burner/', options).then((answer) => {
                  if (!answer.ok) { throw answer }
                  return (answer.json())
            }).catch(error => {
                  throw error
            })
      },

      stopCdBurnerService() {

            let options = {
                  method: 'DELETE',
                  headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                  }
            }

            return fetch('/api/monitoring/burner/', options).then((answer) => {
                  if (!answer.ok) { throw answer }
            }).catch((error) => { throw error })

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
                  throw error
            })

      },

      cancelCdBurner(jobBurnerID) {

            let options = {
                  method: 'POST',
                  headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                  },
                  body: JSON.stringify([])
            }

            return fetch('/api/monitoring/burner/jobs/' + jobBurnerID + '/cancel', options).then((answer) => {
                  if (!answer.ok) { throw answer }
            }).catch((error) => {
                  throw error
            })

      }

}

export default cdBurner