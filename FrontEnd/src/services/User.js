import { toastifyError, toastifySuccess } from './toastify'

const user = {
    getUsers(){

      const getUsersOption = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    } 

        return fetch('/users/users', getUsersOption ).then((answer) => {
            if (!answer.ok) { throw answer }
              return answer.json()
          }).catch(async error => {
            let errorText = await error.text()
            toastifyError(errorText)
          })
    }, 

    modifyUser(data){
      const modifyUserOption = {
        method: 'PUT', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
      }

      return fetch('/users/users', modifyUserOption ).then((answer) => {
        if (!answer.ok) { throw answer }
          toastifySuccess('User Modify with success')
      }).catch(async error => {
        let errorText = await error.text()
        toastifyError(errorText)
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
      
      return fetch('/users/users', deleteUserOption ).then((answer) => {
        if (!answer.ok) { throw answer }
          toastifySuccess('User Delete with success')
      }).catch(async error => {
        let errorText = await error.text()
        toastifyError(errorText)
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

      return fetch('/users/users', createUserOption ).then((answer) => {
        if (!answer.ok) { throw answer }
          toastifySuccess('user created with success')
      }).catch(async error => {
        console.log(error)
        let errorText = await error.text()
        toastifyError(errorText)
      })
    }
}

export default user