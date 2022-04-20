import axios from "axios"

const role = {

    getRoles() {

        return axios.get('/api/roles').then((answer) => answer.data
        ).catch(error => {
            throw error
        })
    },

    getPermission(name) {

        return axios.get('/api/roles/' + name).then((answer) => answer.data
        ).catch(error => {
            throw error
        })
    },

    createRole(payload) {

        return axios.post('/api/roles', payload).then((answer) =>
            true
        ).catch(error => {
            throw error
        })
    },

    modifyRole(payload) {

        return axios.put('/api/roles', payload).then((answer) => true
        ).catch(error => {
            throw error
        })
    },

    deleteRole(name) {

        return axios.delete('/api/roles', [name]).then((answer) =>
            true
        ).catch(error => {
            throw error
        })
    }

}

export default role