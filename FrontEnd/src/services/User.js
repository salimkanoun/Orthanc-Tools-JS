import { toastifyError } from './toastify'

const user = {
    getUsers(){
        return fetch('/api/user', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
        }).then((answer) => {
            if (!answer.ok) { throw answer }
              return answer.json()
          }).catch(error => {
            toastifyError(error)
          })
    }, 

    modifyUser(data){
      return fetch('/api/user', {
        method: 'POST', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
      }).then((answer) => {
        if (!answer.ok) { throw answer }
          return answer.json()
      }).catch(error => {
        toastifyError(error)
      })
    },

    deleteUser(username){
      return fetch('/api/user', {
        method: 'DELETE', 
        body: JSON.stringify(username)
      }).then((answer) => {
        if (!answer.ok) { throw answer }
          console.log('user delete with success')
      }).catch(error => {
        toastifyError(error)
      })
    }, 

    createUser(data){
      return fetch('/api/user/create', {
        method: 'POST', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)

      }).then((answer) => {
        if (!answer.ok) { throw answer }
          console.log('user created with success')
      }).catch(error => {
        toastifyError(error)
      })
    }
}

export default user