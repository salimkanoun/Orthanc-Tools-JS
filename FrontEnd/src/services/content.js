import { toastifyError } from "./toastify"

export default {

    getOrthancFind(contentSerch){

        const getContentOption = {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contentSerch)
        }

        return fetch('/api/tools/find', getContentOption).then((response) => {
            if (!response.ok) {throw response}
            return response.json()
        }).catch((error) => {
            throw(error)
        })
    },

    getStudiesDetails(ID){

        const getStudiesDetailsOption = {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/studies/' + ID+ '?expand', getStudiesDetailsOption ).then((response) => {
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

        const getSeriesDetailsOption = {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/studies/' + studyID + '/series?expand', getSeriesDetailsOption ).then((response) => {
            if (!response.ok) {throw response}
            return response.json()
        }).catch((error) => {
            toastifyError(error)
        })
    },

    getSeriesDetailsByID(serieID){

        const getSeriesDetailsByIDOption = {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/series/' + serieID + '?expand', getSeriesDetailsByIDOption ).then((response) => {
            if (!response.ok) {throw response}
            return response.json()
        }).catch((error) => {
            toastifyError(error)
        })
    },

    getSeriesInstances(serieID){

        const getSeriesInstancesOption =  {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/series/' + serieID + '/instances', getSeriesInstancesOption ).then((response) => {
            if (!response.ok) {throw response}
            return response.json()
        }).catch((error) => {
            toastifyError(error)
        })
    },

    getInstances(instanceID){

        const getInstancesOption = {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/instances/' + instanceID + '/tags', getInstancesOption ).then((response) => {
            if (!response.ok) {throw response}
            return response.json()
        }).catch((error) => {
            toastifyError(error)
        })
    },

    getSharedTags(serieID){

        const getSharedTagsOption = {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/series/' + serieID + '/shared-tags', getSharedTagsOption ).then((response) => {
            if (!response.ok) {throw response}
            return response.json()
        }).catch((error) => {
            toastifyError(error)
        })
    },

    getHeader(serieID){

        const getHeaderOption = {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/instances/' + serieID + '/header', getHeaderOption ).then((response) => {
            if (!response.ok) {throw response}
            return response.json()
        }).catch((error) => {
            toastifyError(error)
        })
    },

    deletePatient(ID){

        const deletePatientOption  =  {
            method: 'DELETE'
        }

        return fetch('/api/patients/' + ID, deletePatientOption ).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })

    },

    deleteStudies(ID){

        const deleteStudiesOption =  {
            method: 'DELETE'
        }

        return fetch('/api/studies/' + ID, deleteStudiesOption ).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })

    },

    deleteSeries(ID){

        const deleteSeriesOption = {
            method: 'DELETE'
        }

        return fetch('/api/series/' + ID, deleteSeriesOption ).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })

    },

    
    modifyPatients(ID, replace, remove, removePrivateTags, keepRessource){

        const modifyPatientsOption = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Replace: replace, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true, Synchronous: false, KeepSource: keepRessource})
        }

        return fetch('/api/patients/' + ID + '/modify', modifyPatientsOption ).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            console.error(error)
        })
    },

    modifyStudy(ID, replace, remove, removePrivateTags, keepRessource){

        const modifyStudyOption =  {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Replace: replace, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true, Synchronous: false, KeepSource: keepRessource})
        }

        return fetch('/api/studies/' + ID + '/modify', modifyStudyOption ).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            console.log(error)
        })
    },

    modifySeries(ID, replace, remove, removePrivateTags, keepRessource){

        const modifySeriesOption = {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Replace: {...replace}, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true, Synchronous: false, KeepSource: keepRessource})
        }

        return fetch('/api/series/' + ID + '/modify', modifySeriesOption ).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            console.log(error)
        })
    }
}

