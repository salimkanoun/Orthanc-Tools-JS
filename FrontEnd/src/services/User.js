import { toastifyError, toastifySuccess } from './toastify'
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

      return fetch('/api/user/modify', updateOptions(modifyUserOption)).then((answer) => {
        if (!answer.ok) { throw answer }
          return answer.json(true)
      }).catch(error => {
        toastifyError(error)
      })
    },

    deleteUser(username){
      const deleteUserOption = {
        method: 'DELETE', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify([username])
      }
      
      return fetch('/api/user/delete', updateOptions(deleteUserOption)).then((answer) => {
        if (!answer.ok) { throw answer }
          toastifySuccess('User Delete with success')
      }).catch(error => {
        console.log(error)
        toastifyError('error')
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
          toastifySuccess('user created with success')
      }).catch(error => {
        toastifyError(error)
      })
    }
}

export default user