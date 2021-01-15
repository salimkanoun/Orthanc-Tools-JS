export default {

    createDeleteRobot(deleteArray, username){

        const createDeleteRobotOption = {
            method: 'POST', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteArray)
        }

        return fetch('/api/robot/' + username + '/delete', createDeleteRobotOption ).then(answer => {
            if (!answer.ok) {throw answer}
            return true
        }).catch(error => {
            throw error
        })
    }
}