import axios from "axios"

const deleteRobot = {

    createDeleteRobot(deleteArray, username) {

        return axios.post('/api/tasks/' + username + '/delete', deleteArray).then(answer =>
            answer.data
        ).catch(error => {
            throw error
        })
    },

    flush() {

        return axios.delete('/api/tasks/type/delete/flush').then(answer => true
        ).catch(error => {
            throw error
        })
    }
}

export default deleteRobot