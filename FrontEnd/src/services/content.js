import axios from "axios"

const orthancContent = {

    getOrthancFind(contentSerch) {
        return axios.post('/api/tools/find', contentSerch).then((response) => response.data
        ).catch((error) => {
            throw (error)
        })
    },

    getStudiesWithLabel(labelName) {
        return axios.get('/api/labels/' + labelName + '/studies').then((response) => response.data
            ).catch((error) => {
                throw (error)
            })
    },

    getPatientDetails(ID) {

        return axios.get('/api/patients/' + ID + '?expand').then((response) => response.data
        ).catch((error) => {
            throw error
        })
    },

    getStudiesDetails(ID) {

        return axios.get('/api/studies/' + ID + '?expand').then((response) => response.data
        ).catch((error) => {
            throw error
        })
    },

    getSeriesDetails(seriesID) {

        return axios.get('/api/series/' + seriesID + '?expand').then((response) => response.data
        ).catch((error) => {
            throw error
        })
    },

    getSeriesInstances(seriesID) {

        return axios.get('/api/series/' + seriesID + '/instances').then((response) => response.data
        ).catch((error) => {
            throw error
        })
    },

    /**
     * Retrieve series details of a study
     * @param {string} studyID 
     */
    getSeriesDetailsOfStudy(studyID) {

        return axios.get('/api/studies/' + studyID + '/series?expand').then((response) => response.data
        ).catch((error) => {
            throw error
        })
    },

    getSeriesDetailsByID(serieID) {

        return axios.get('/api/series/' + serieID + '?expand').then((response) => response.data
        ).catch((error) => {
            throw error
        })
    },

    getSeriesInstances(serieID) {
        return axios.get('/api/series/' + serieID + '/instances').then((response) => response.data
        ).catch((error) => {
            throw error
        })
    },

    getInstances(instanceID) {

        return axios.get('/api/instances/' + instanceID + '/tags').then((response) => response.data
        ).catch((error) => {
            throw error
        })
    },

    getSharedTags(serieID) {

        return axios.get('/api/series/' + serieID + '/shared-tags').then((response) => response.data
        ).catch((error) => {
            throw error
        })
    },

    getHeader(serieID) {

        return axios.get('/api/instances/' + serieID + '/header').then((response) => response.data
        ).catch((error) => {
            throw error
        })
    },

    deletePatient(ID) {

        return axios.delete('/api/patients/' + ID).then(() => true
        ).catch((error) => {
            throw error
        })

    },

    deleteStudies(ID) {

        return axios.delete('/api/studies/' + ID).then(() => true
        ).catch((error) => {
            throw error
        })

    },

    deleteSeries(ID) {

        return axios.delete('/api/series/' + ID).then(() => true
        ).catch((error) => {
            throw error
        })

    },


    modifyPatients(ID, replace, remove, removePrivateTags, keepRessource) {

        return axios.post('/api/patients/' + ID + '/modify', { Replace: replace, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true, Synchronous: false, KeepSource: keepRessource }).then((answer) =>
            answer.data
        ).catch((error) => {
            throw error
        })
    },

    modifyStudy(ID, replace, remove, removePrivateTags, keepRessource) {

        return axios.post('/api/studies/' + ID + '/modify', { Replace: replace, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true, Synchronous: false, KeepSource: keepRessource }).then((answer) =>
            answer.data
        ).catch((error) => {
            throw error
        })
    },

    modifySeries(ID, replace, remove, removePrivateTags, keepRessource) {

        return axios.post('/api/series/' + ID + '/modify', { Replace: { ...replace }, Remove: remove, RemovePrivateTags: removePrivateTags, Force: true, Synchronous: false, KeepSource: keepRessource }).then((answer) =>
            answer.data
        ).catch((error) => {
            throw error
        })
    }
}

export default orthancContent

