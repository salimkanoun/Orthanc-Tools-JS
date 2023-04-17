import axios from "axios";

const retrieveRobot = {

    createRobot(username, projectName, retrieveArray) {

        return axios.post('/api/tasks/' + username + '/retrieve', {
            projectName: projectName,
            retrieveArray: retrieveArray
        }).then((answer) => answer.data
        ).catch(async (error) => {
            throw await error.data.then(e => ({
                ...e,
                statusText: error.statusText,
                status: error.status
            }))
        })

    },

    validateRobot(id) {

        return axios.post("/api/tasks/retrieve/" + id + "/validate").then((answer) => answer.data
        ).catch(error => {
            throw error
        })
    },

    deleteRobot(id) {

        return axios.delete("/api/tasks/" + id).catch((error) => {
            throw error
        })
    },

    deleteRobotUser(username) {

        return axios.delete("/api/tasks/" + username + "/retrieve").catch((error) => {
            throw error
        })
    },

    getAllRobotsDetails() {

        return axios.get("/api/tasks/type/retrieve").then((answer) => answer.data
        ).catch(error => {
            throw error
        })
    },

    deleteRobotItem(id, item) {

        return axios.delete("/api/tasks/retrieve/" + id + "/" + item).then((answer) => true).catch((error) => {
            throw error
        })

    },

    retryRobotItem(id, item) {

        return axios.put(`/api/tasks/retrieve/${id}/${item}/retry`).then((answer) => true
        ).catch((error) => {
            throw error
        })

    },


    flush() {

        return axios.delete('/api/tasks/type/retrieve/flush').then(answer => true
        ).catch(error => {
            throw error
        })
    }

}

export default retrieveRobot