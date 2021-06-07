const peers = {

    getPeers() {
        return fetch('/api/peers')
            .then((answer) => {
                if (!answer.ok) { throw answer }
                return (answer.json())
            })
            .catch((error) => {
                throw error
            })
    },

    getPeersExpand() {
        return fetch('/api/peers?expand')
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

        const updatePeerOption = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(putData)
        }

        return fetch('/api/peers/' + name, updatePeerOption).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            throw error
        })
    },

    deletePeer(name) {

        const deletePeerOption = {
            method: 'DELETE'
        }

        return fetch('/api/peers/' + name, deletePeerOption).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            throw error
        })
    },

    echoPeer(peerName) {
        return fetch('/api/peers/' + peerName + '/system').then(response => {
            if (response.ok) return response.json()
            else throw response
        })
    },

    storePeer(name, orthancIDsArray) {

        const storePeerOption = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                Synchronous: false,
                Resources: orthancIDsArray
            })
        }

        return fetch('/api/peers/' + name + '/store', storePeerOption).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch(error => {
            throw error
        })
    }
}

export default peers