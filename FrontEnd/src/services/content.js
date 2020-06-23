import { toastifyError } from "./toastify";
import updateOptions from '../authorizedOption'

const query  = {

    getContent(contentSerch){

        const getContentOption = {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contentSerch)
        }

        return fetch('/api/tools/find', updateOptions(getContentOption)).then((response) => {
            if (!response.ok) {throw response}
            return response.json()
        }).catch((error) => {
            toastifyError(error)
        })
    },

    getPatientsDetails(ID){

        const getPatientsDetailsOption = {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/patients/' + ID + '?expand', updateOptions(getPatientsDetailsOption)).then((response) => {
            if (!response.ok) {throw response}
            return response.json()
        }).catch((error) => {
            toastifyError(error)
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

        return fetch('/api/studies/' + ID+ '?expand', updateOptions(getStudiesDetailsOption)).then((response) => {
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

        return fetch('/api/studies/' + studyID + '/series?expand', updateOptions(getSeriesDetailsOption)).then((response) => {
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

        return fetch('/api/series/' + serieID + '?expand', updateOptions(getSeriesDetailsByIDOption)).then((response) => {
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

        return fetch('/api/series/' + serieID + '/instances', updateOptions(getSeriesInstancesOption) ).then((response) => {
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

        return fetch('/api/instances/' + instanceID + '/tags?simplify', updateOptions(getInstancesOption) ).then((response) => {
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

        return fetch('/api/series/' + serieID + '/shared-tags?simplify', updateOptions(getSharedTagsOption)).then((response) => {
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

        return fetch('/api/instances/' + serieID + '/header?simplify', updateOptions(getHeaderOption)).then((response) => {
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

        return fetch('/api/patients/' + ID, updateOptions(deletePatientOption) ).then((answer) => {
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

        return fetch('/api/studies/' + ID, updateOptions(deleteStudiesOption) ).then((answer) => {
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

        return fetch('/api/series/' + ID, updateOptions(deleteSeriesOption) ).then((answer) => {
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
            body: JSON.stringify({Replace: {...replace}, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true, Synchronous: false, KeepSource: keepRessource})
        }

        return fetch('/api/patients/' + ID + '/modify', updateOptions(modifyPatientsOption) ).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            console.log(error)
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

        return fetch('/api/studies/' + ID + '/modify', updateOptions(modifyStudyOption) ).then((answer) => {
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

        return fetch('/api/series/' + ID + '/modify', updateOptions(modifySeriesOption) ).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch((error) => {
            console.log(error)
        })
    }
}

export default query

