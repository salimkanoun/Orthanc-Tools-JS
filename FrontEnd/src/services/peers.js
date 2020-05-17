import { toastifySuccess, toastifyError } from './toastify'

const peers = {

    getPeers(){
        return fetch('/api/peers')
            .then((answer) => {
                if (!answer.ok) { throw answer }
                return (answer.json())
            })
            .catch((error) => {
                toastifyError(error)
                return []
            })
    },

    getPeersExpand(){
        return fetch('/api/peers?expand')
            .then((answer) => {
                if (!answer.ok) { throw answer }
                return (answer.json())
            })
            .catch((error) => {
                toastifyError(error)
            })
    },

    updatePeer(name, parameters){
        return fetch('/api/peers/'+ name, {
            method: 'PUT', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify(parameters)
        }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })
    },

    deletePeer(name){
        return fetch('/api/peers/' + name, {
            method: 'DELETE'
        }).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })
    },

    echoPeer(peerName){
        fetch ('/api/peers/' + peerName + '/system').then(response => {
            if (response.ok) return response.json()
            else throw response
        }).then((response) => {
            toastifySuccess('Version ' + peerName + ' = ' + response.Version)
        }).catch(error => toastifyError('Echo ' + peerName + ' Error'))
    }, 

    storePeer(name, orthancIDsArray){
        return fetch ('/api/peers/' + name + '/store', {
            method: 'POST', 
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Synchronous : false,
                Resources : orthancIDsArray
            })
        }).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch(error => {
            toastifyError(error)
        })
    }
}

export default peers