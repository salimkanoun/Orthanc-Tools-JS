import { toastifyError, toastifySuccess } from "./toastify";

const query  = {

    getContent(contentSerch){
        return fetch('/api/tools/find', {
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

    getPatientsDetails(ID){
        return fetch('/api/patients/' + ID + '?expand', {
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

    getStudiesDetails(ID){
        return fetch('/api/studies/' + ID+ '?expand', {
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

    /**
     * Retrieve series details of a study
     * @param {string} studyID 
     */
    getSeriesDetails(studyID){
        return fetch('/api/studies/' + studyID + '/series?expand', {
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

    getSeriesDetailsByID(serieID){
        return fetch('/api/series/' + serieID + '?expand', {
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
        return fetch('/api/patients/' + ID, {
            method: 'DELETE'
        }).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })

    },

    deleteStudies(ID){
        return fetch('/api/studies/' + ID, {
            method: 'DELETE'
        }).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })

    },

    deleteSeries(ID){
        return fetch('/api/series/' + ID, {
            method: 'DELETE'
        }).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })

    },

    
    modifyPatients(ID, replace, remove, removePrivateTags){
        return fetch('/api/patients/' + ID + '/modify', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Replace: {...replace}, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true})
        }).then((answer) => {
            if (!answer.ok) {throw answer}
            toastifySuccess('Patient have been modified')
            return (answer.json())
        }).catch((error) => {
            console.log(error)
        })
    },

    modifyStudy(ID, replace, remove, removePrivateTags){
        return fetch('/api/studies/' + ID + '/modify', {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Replace: {...replace}, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true})
        }).then((answer) => {
            if (!answer.ok) {throw answer}
            toastifySuccess('Study have been modified')
            return (answer.json())
        }).catch((error) => {
            console.log(error)
        })
    },

    modifySeries(ID, replace, remove, removePrivateTags){
        return fetch('/api/series/' + ID + '/modify', {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Replace: {...replace}, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true})
        }).then((answer) => {
            if (!answer.ok) {throw answer}
            toastifySuccess('Serie have been modified')
            return (answer.json())
        }).catch((error) => {
            console.log(error)
        })
    }
}

export default query

