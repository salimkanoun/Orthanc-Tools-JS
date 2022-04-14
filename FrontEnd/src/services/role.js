import axios from "axios"

const role = {

    getRoles() {

        return axios.get('/api/roles').then((answer) => {
            if (!answer.ok) { throw answer }
            return answer.json()
        }).catch(error => {
            throw error
        })
    },

    getPermission(name) {

        return axios.get('/api/roles/' + name).then((answer) => {
            if (!answer.ok) { throw answer }
            return answer.json()
        })
    },

    createRole(payload) {

        return axios.post('/api/roles', payload).then((answer) => {
            if (!answer.ok) { throw answer }
            return true
        })
    },

    modifyRole(payload) {

        return axios.put('/api/roles', payload).then((answer) => {
            if (!answer.ok) { throw answer }
            return true
        })
    },

    deleteRole(name) {

        return axios.delete('/api/roles', [name]).then((answer) => {
            if (!answer.ok) { throw answer }
            return true
        })
    }

}

export default role