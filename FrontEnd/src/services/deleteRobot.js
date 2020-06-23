import { toastifyError } from './toastify'

const deleteRobot = {

    createDeleteRobot(deleteArray){
        return fetch('/api/robot/salim/delete', {
            method: 'POST', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteArray)
        }).then(answer => {
            if (!answer.ok) {throw answer}
            return answer.json()
        }).catch(error => {
            toastifyError('error', error)
        })
    }, 

    getDeleteRobot(){
        return fetch('/api/robot/salim/delete', {
            method: 'GET', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(answer => {
            if (!answer.ok) {throw answer}
            return answer.json()
        }).catch(error => {
            toastifyError(error)
        })
    }


}

export default deleteRobot