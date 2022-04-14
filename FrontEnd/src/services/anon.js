import axios from "axios"

const anonymize =  {

    //SK ICI DOIT REJOINDRE TASK DU COUP ?
    createAnonRobot(anonymizeArray, username){
        
        return axios.post('/api/tasks/' + username + '/anonymize', anonymizeArray).then(answer => {
            if (!answer.ok) {throw answer}
            return answer.data
        }).catch(error => {
            throw error
        })

    },

    flush(){
        
        return axios.delete('/api/tasks/type/anonymize/flush').then(answer => {
            if (!answer.ok) {throw answer}
            return true
        }).catch(error => {
            throw error
        })
    }

}

export default anonymize