import { toastifyError } from "./toastify"

const endpoints = {
    getEndpoints(){
        return fetch('/api/endpoints')
        .then((answer) => {
          if (!answer.ok) { throw answer }
          return (answer.json())
        })
        .catch((error) => {
          toastifyError(error)
        })
    },

    deleteEndpoints(id){
        return fetch('api/endpoints/', {
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

    createEndpoint(postData){
        return fetch('api/endpoints/create', {
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
} 

export default endpoints