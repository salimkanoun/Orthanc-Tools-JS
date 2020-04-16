import { toastifyError } from "./toastify";

const query  = {

    getContent(contentSerch){
        return fetch('api/tools/find', {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contentSerch)
        }).then((response) => {
            if (!response.ok) {throw response}
            return response.json()
        }).catch((error) => {
            toastifyError(error)
        })
    },

    getSeriesDetails(series){
        return fetch('api/series/' + series, {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (!response.ok) {throw response}
            return response.json()
        }).catch((error) => {
            toastifyError(error)
        })
    },

    deletePatient(ID){
        return fetch('api/patients/' + ID, {
            method: 'DELETE'
        }).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })

    },

    deleteStudies(ID){
        return fetch('api/studies/' + ID, {
            method: 'DELETE'
        }).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })

    },

    deleteSeries(ID){
        return fetch('api/series/' + ID, {
            method: 'DELETE'
        }).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })

    }
}

export default query

