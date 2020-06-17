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
            console.log(answer.json())
            if (!answer.ok) { throw answer }
            return answer.json()
          }).catch(error => {
            toastifyError(error)
          })
    }
}

export default user