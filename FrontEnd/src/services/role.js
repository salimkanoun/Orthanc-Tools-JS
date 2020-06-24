import { toastifyError } from './toastify'
import updateOptions from '../authorizedOption'

const role = {


    getRoles(){
        const getRolesOptions = {
            method: 'GET', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/roles', updateOptions(getRolesOptions)).then((answer) => {
            if (!answer.ok) { throw answer }
                return answer.json()
            }).catch(error => {
            toastifyError(error)
            })
    }
}

export default role