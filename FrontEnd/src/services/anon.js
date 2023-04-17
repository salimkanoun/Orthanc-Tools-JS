import axios from "axios"

const anonymize =  {

    //SK ICI DOIT REJOINDRE TASK DU COUP ?
    createAnonRobot(anonymizeArray, username){
        
        return axios.post('/api/tasks/' + username + '/anonymize', anonymizeArray).then(answer => 
            answer.data
        ).catch(error => {
            throw error
        })

    },

    flush(){
        
        return axios.delete('/api/tasks/type/anonymize/flush').then(answer =>  true
        ).catch(error => {
            throw error
        })
    }

}

export default anonymize