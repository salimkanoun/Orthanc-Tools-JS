import axios from "axios"

const peers = {

    getPeers() {
        return axios.get('/api/peers')
            .then((answer) => {
                if (!answer.ok) { throw answer }
                return (answer.json())
            })
            .catch((error) => {
                throw error
            })
    },

    getPeersExpand() {
        return axios.get('/api/peers?expand')
            .then((answer) => {
                if (!answer.ok) { throw answer }
                return (answer.json())
            })
            .catch((error) => {
                throw error
            })
    },

    updatePeer(name, hostname, port, username, password) {

        let putData = {
            PeerName: name,
            Url: hostname + ":" + port,
            Username: username,
            Password: password
        }

        return axios.put('/api/peers/' + name, putData).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            throw error
        })
    },

    deletePeer(name) {

        return axios.delete('/api/peers/' + name).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            throw error
        })
    },

    echoPeer(peerName) {
        return axios.get('/api/peers/' + peerName + '/system').then(response => {
            if (response.ok) return response.json()
            else throw response
        })
    },

    storePeer(name, orthancIDsArray) {

        return axios.post('/api/peers/' + name + '/store', {
            Synchronous: false,
            Resources: orthancIDsArray
        }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch(error => {
            throw error
        })
    }
}

export default peers