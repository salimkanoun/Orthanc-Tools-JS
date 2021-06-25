const deleteRobot = {

    createDeleteRobot(deleteArray, username) {

        const createDeleteRobotOption = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(deleteArray)
        }

        return fetch('/api/tasks/' + username + '/delete', createDeleteRobotOption).then(answer => {
            if (!answer.ok) { throw answer }
            return answer.text()
        }).catch(error => {
            throw error
        })
    },

    flush(){
        const flushDeleRobotsOption = {
            method: 'DELETE'
        }

        return fetch('/api/tasks/type/delete/flush', flushDeleRobotsOption ).then(answer => {
            if (!answer.ok) {throw answer}
            return true
        }).catch(error => {
            throw error
        })
    }
}

export default deleteRobot