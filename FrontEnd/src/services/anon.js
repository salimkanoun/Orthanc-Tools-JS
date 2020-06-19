import { toastifyError } from './toastify'

const anon = {


    createAnonRobot(anonymizeArray){
        //SK user salim hardcodé
        return fetch('/api/robot/salim/anonymize', {
            method: 'POST', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(anonymizeArray)
        }).then(answer => {
            if (!answer.ok) {throw answer}
            return answer.json()
        }).catch(error => {
            toastifyError(error)
        })

    },

    getAnonJob(){
        return fetch('/api/robot/salim/anonymize', {
            method: 'GET', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
        }).then(answer => {
            if (!answer.ok) {throw answer}
            return answer.json()
        }).catch(error => {
            toastifyError(error)
        })
    }
}

export default anon