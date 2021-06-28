const anonymize =  {

    //SK ICI DOIT REJOINDRE TASK DU COUP ?
    createAnonRobot(anonymizeArray, username){
        
        const createAnonRobotOption = {
            method: 'POST', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
              },
              body: JSON.stringify(anonymizeArray)
        }
        
        return fetch('/api/tasks/' + username + '/anonymize', createAnonRobotOption ).then(answer => {
            if (!answer.ok) {throw answer}
            return answer.text()
        }).catch(error => {
            throw error
        })

    },

    flush(){
        const flushAnonRobotsOption = {
            method: 'DELETE'
        }

        return fetch('/api/tasks/type/anonymize/flush', flushAnonRobotsOption ).then(answer => {
            if (!answer.ok) {throw answer}
            return true
        }).catch(error => {
            throw error
        })
    }

}

export default anonymize