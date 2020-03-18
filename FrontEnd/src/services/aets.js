import { toast } from 'react-toastify';

const apis = {

    async getAets() {
        let aetsAnswers = await fetch('/api/modalities').then((answer) => { return answer.json() }).catch((error)=>{
            toastifyError(error)
        })
        return aetsAnswers
    },

    async getAetsExpand(){
        let aetsAnswers = await fetch('/api/modalities?expand').then((answer) => { return answer.json() }).catch((error)=>{
            toastifyError(error)
        })
        return aetsAnswers

    },

    async updateAet(name, parameters){
        await fetch("/api/modalities/"+name, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parameters)
        })

    },

    deleteAet(name){
        return fetch('/api/modalities/'+name, {
            method : 'DELETE'
        })
    },

    echoAet(aetName){
        fetch('/api/modalities/' + aetName + '/echo', {
                method : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })
        .then( response => {
            if (response.ok) response.json()
            else throw response
        })
        .then( (answer) => {
            toastifySuccess('Echo ' + aetName +' Sucess')
        })
        .catch(error => toastifyError('Echo ' + aetName +' Error'))
    }

}

function toastifySuccess(message) {

    toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    })
}

function toastifyError(message){
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    });
}

export default apis