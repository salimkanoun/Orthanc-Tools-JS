import { toastifyError } from './toastify'
import updateOptions from '../authorizedOption'

const anon = {

    createAnonRobot(anonymizeArray, username){
        
        const createAnonRobotOption = {
            method: 'POST', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(anonymizeArray)
        }
        
        return fetch('/api/robot/' + username + '/anonymize', updateOptions(createAnonRobotOption) ).then(answer => {
            if (!answer.ok) {throw answer}
            return answer.json()
        }).catch(error => {
            toastifyError(error)
        })

    },

    getAnonJob(username){

        const getAnonJobOption = {
            method: 'GET', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
        }

        return fetch('/api/robot/' + username + '/anonymize', updateOptions(getAnonJobOption) ).then(answer => {
            if (!answer.ok) {throw answer}
            return answer.json()
        }).catch(error => {
            toastifyError(error)
        })
    }
}

export default anon