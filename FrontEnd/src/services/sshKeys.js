
const { toastifyError } = require("./toastify")

const sshKeys = {
    getKeysExpend(){
        return fetch('/api/keys')
        .then((answer) => {
          if (!answer.ok) { throw answer }
          return (answer.json())
        })
        .catch((error) => {
          toastifyError(error)
        })
    },
    
    deleteKey(id){
        return fetch('api/keys/', {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:id})
          } ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          })
            .catch((error) => {
              toastifyError(error)
            })
    },

    createKey(postData){
        return fetch('api/keys/create', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
          } ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          })
            .catch((error) => {
              toastifyError(error)
            })
    },

    async uploadKey(id, file){
        console.log(file);
        let fileText = await file.text()
        return fetch('api/keys/upload/'+id, {
            method: 'POST',
            headers: {
                Accept: 'text/plain',
                'Content-Type': 'text/plain'
            },
            body: fileText
        }).then((answer) => {
            if (!answer.ok) { throw answer }
        }).catch((error) => {
            toastifyError(error)
        })
    }
}

export default sshKeys