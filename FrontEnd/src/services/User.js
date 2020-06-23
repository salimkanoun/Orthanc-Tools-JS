import { toastifyError } from './toastify'
import updateOptions from '../authorizedOption'

const user = {
    getUsers(){

      const getUsersOption = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    } 

        return fetch('/api/user', updateOptions(getUsersOption)).then((answer) => {
            if (!answer.ok) { throw answer }
              return answer.json()
          }).catch(error => {
            toastifyError(error)
          })
    }, 

    modifyUser(data){

      const modifyUserOption = {
        method: 'POST', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
      }

      return fetch('/api/user', updateOptions(modifyUserOption)).then((answer) => {
        if (!answer.ok) { throw answer }
          return answer.json()
      }).catch(error => {
        toastifyError(error)
      })
    },

    deleteUser(username){

      const deleteUserOption = {
        method: 'DELETE', 
        body: JSON.stringify(username)
      }

      return fetch('/api/user', updateOptions(deleteUserOption)).then((answer) => {
        if (!answer.ok) { throw answer }
          console.log('user delete with success')
      }).catch(error => {
        toastifyError(error)
      })
    }, 

    createUser(data){

      const createUserOption = {
        method: 'POST', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)

      }

      return fetch('/api/user/create', updateOptions(createUserOption)).then((answer) => {
        if (!answer.ok) { throw answer }
          console.log('user created with success')
      }).catch(error => {
        toastifyError(error)
      })
    }
}

export default user