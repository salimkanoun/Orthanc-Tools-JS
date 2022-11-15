import axios from "axios"
import { toast } from "react-toastify"

const orthancContent = {

    getOrthancFind(contentSerch) {

        return axios.post('/api/tools/find', contentSerch).then((response) => response.data
        ).catch((error) => {
            throw (error)
        })
    },

    getPatientDetails(ID) {

        return axios.get('/api/patients/' + ID + '?expand').then((response) => response.data
        ).catch((error) => {
            toast.error(error)
        })
    },

    getStudiesDetails(ID) {

        return axios.get('/api/studies/' + ID + '?expand').then((response) => response.data
        ).catch((error) => {
            toast.error(error)
        })
    },

    /**
     * Retrieve series details of a study
     * @param {string} studyID 
     */
    getSeriesDetails(studyID) {

        return axios.get('/api/studies/' + studyID + '/series?expand').then((response) => response.data
        ).catch((error) => {
            toast.error(error)
        })
    },

    getSeriesDetailsByID(serieID) {

        return axios.get('/api/series/' + serieID + '?expand').then((response) => response.data
        ).catch((error) => {
            toast.error(error)
        })
    },

    getSeriesInstances(serieID) {
        return axios.get('/api/series/' + serieID + '/instances').then((response) => response.data
        ).catch((error) => {
            toast.error(error)
        })
    },

    getInstances(instanceID) {

        return axios.get('/api/instances/' + instanceID + '/tags').then((response) => response.data
        ).catch((error) => {
            toast.error(error)
        })
    },

    getSharedTags(serieID) {

        return axios.get('/api/series/' + serieID + '/shared-tags').then((response) => response.data
        ).catch((error) => {
            toast.error(error)
        })
    },

    getHeader(serieID) {

        return axios.get('/api/instances/' + serieID + '/header').then((response) => response.data
        ).catch((error) => {
            toast.error(error)
        })
    },

    deletePatient(ID) {

        return axios.delete('/api/patients/' + ID).then((answer) => true
        ).catch((error) => {
            throw error.statusText
        })

    },

    deleteStudies(ID) {

        return axios.delete('/api/studies/' + ID).then((answer) => true
        ).catch((error) => {
            throw error.statusText
        })

    },

    deleteSeries(ID) {

        return axios.delete('/api/series/' + ID).then((answer) => true
        ).catch((error) => {
            throw error.statusText
        })

    },


    modifyPatients(ID, replace, remove, removePrivateTags, keepRessource) {

        return axios.post('/api/patients/' + ID + '/modify', { Replace: replace, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true, Synchronous: false, KeepSource: keepRessource }).then((answer) =>
            answer.data
        ).catch((error) => {
            console.error(error)
        })
    },

    modifyStudy(ID, replace, remove, removePrivateTags, keepRessource) {

        return axios.post('/api/studies/' + ID + '/modify', { Replace: replace, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true, Synchronous: false, KeepSource: keepRessource }).then((answer) =>
            answer.data
        ).catch((error) => {
            console.error(error)
        })
    },

    modifySeries(ID, replace, remove, removePrivateTags, keepRessource) {

        return axios.post('/api/series/' + ID + '/modify', { Replace: { ...replace }, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true, Synchronous: false, KeepSource: keepRessource }).then((answer) => 
            answer.data
        ).catch((error) => {
                console.error(error)
            })
    }
}

export default orthancContent

