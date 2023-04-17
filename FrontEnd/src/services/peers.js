import axios from "axios"

const peers = {

    getPeers() {
        return axios.get('/api/peers')
            .then((answer) =>
                answer.data
            )
            .catch((error) => {
                throw error
            })
    },

    getPeersExpand() {
        return axios.get('/api/peers?expand')
            .then((answer) => answer.data
            )
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

        return axios.put('/api/peers/' + name, putData).then((answer) => answer.data
        ).catch((error) => {
            throw error
        })
    },

    deletePeer(name) {

        return axios.delete('/api/peers/' + name).then((answer) => answer.jdata
        ).catch((error) => {
            throw error
        })
    },

    echoPeer(peerName) {
        return axios.get('/api/peers/' + peerName + '/system').then(response => response.data
        ).catch(error => {
            throw error
        })
    },

    storePeer(name, orthancIDsArray) {

        return axios.post('/api/peers/' + name + '/store', {
            Synchronous: false,
            Resources: orthancIDsArray
        }).then((answer) => answer.data
        ).catch(error => {
            throw error
        })
    }
}

export default peers