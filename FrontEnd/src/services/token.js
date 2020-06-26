import { toastifyError } from './toastify'
import updateOptions from '../authorizedOption'


const token = {

    decodeCookie(){
        const tokenOptions = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/token', updateOptions(tokenOptions)).then((answer) => {
            if (!answer.ok) { throw answer }
            return answer.json()
          }).catch(error => {
            toastifyError(error.statusText)
          })
    }

    
    

}

export default token