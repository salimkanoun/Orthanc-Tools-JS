import { toastifySuccess, toastifyError } from './toastify'


const peers = {

    getPeersExpand(){
        return fetch('/api/peers?expand')
            .then((answer) => {
                if (!answer.ok) {throw answer}
                return (answer.json())
            }).catch((error) => {
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
            body: {
                'Url': parameters.Host,
                'Username': parameters.User,
                'Password': parameters.Pass
            } 
        }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        })
            .catch((error) => {
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
        fetch ('/api/peers/' + peerName + '/system', {
            method : 'POST', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({})
        }).then(response => {
            if (!response.ok) {throw response}
            response.json()
        }).then((answer) => {
            toastifySuccess('Echo ' + peerName + ' Sucess') 
        }).catch(error => toastifyError('Echo ' + peerName + ' Error'))
    }
}

export default peers