import axios from "axios"

const role = {

    getRoles() {
        return axios.get('/api/roles').then((answer) => answer.data
        ).catch(error => {
            throw error
        })
    },

    getRole(name) {
        return axios.get('/api/roles/' + name).then((answer) => answer.data
        ).catch(error => {
            throw error
        })
    },

    createRole(payload) {
        return axios.post('/api/roles', payload).then(() =>
            true
        ).catch(error => {
            throw error
        })
    },

    modifyRole(roleName, payload) {
        return axios.put('/api/roles/'+roleName, payload).then(() => true
        ).catch(error => {
            throw error
        })
    },

    deleteRole(roleName) {
        return axios.delete('/api/roles/'+roleName).then(() =>
            true
        ).catch(error => {
            throw error
        })
    }

}

export default role