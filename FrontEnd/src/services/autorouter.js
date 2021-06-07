const autorouter = {

  startAutorouterService() {
        let options = {
              method: 'POST',
              headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
              },
              body: JSON.stringify([])
        }

        return fetch('/api/monitoring/autorouter', options).then((answer) => {
              if (!answer.ok) { throw answer }
              return (answer.json())
        }).catch(error => {
              throw error
        })
  },

  stopAutorouterService() {

        let options = {
              method: 'DELETE',
              headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
              }
        }

        return fetch('/api/monitoring/autorouter', options).then((answer) => {
              if (!answer.ok) { throw answer }
        }).catch((error) => { throw error })

  },

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