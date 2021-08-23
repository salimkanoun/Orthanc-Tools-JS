const retrieveRobot = {

    createRobot(username, projectName, retrieveArray) {

        const createRobotOption = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                projectName: projectName,
                retrieveArray: retrieveArray
            })
        }

        return fetch('/api/tasks/' + username + '/retrieve', createRobotOption).then((answer) => {
            if (!answer.ok) {
                throw answer
            }
            return answer.text();
        }).catch(async (error) => {
            throw await error.json().then(e => ({
                ...e,
                statusText: error.statusText,
                status: error.status
            }))
        })

    },

    validateRobot(id) {

        const validateRobotOption = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            }
        }

        return fetch("/api/tasks/retrieve/" + id + "/validate", validateRobotOption).then((answer) => {
            if (!answer.ok) {
                throw answer
            }
            return (answer.json())
        })
    },

    deleteRobot(id) {

        const deleteRobotOption = {
            method: "DELETE",
        }

        return fetch("/api/tasks/" + id, deleteRobotOption).catch((error) => {
            throw error
        })
    },

    deleteRobotUser(username) {

        const deleteRobotOption = {
            method: "DELETE",
        }

        return fetch("/api/tasks/" + username + "/retrieve", deleteRobotOption).catch((error) => {
            throw error
        })
    },

    getAllRobotsDetails() {

        const getAllRobotsDetails = {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            }
        }

        return fetch("/api/tasks/type/retrieve", getAllRobotsDetails).then((answer) => {
            if (!answer.ok) {
                throw answer
            }
            return (answer.json())
        })
    },

    deleteRobotItem(id, item) {

        const deleteRobotItemOption = {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            }
        }

        return fetch("/api/tasks/retrieve/" + id + "/" + item, deleteRobotItemOption).then((answer) => {
            if (!answer.ok) {
                throw answer
            }
            return;
        }).catch((error) => {
            throw error
        })

    },

    retryRobotItem(id, item) {

        const retryRobotItemOption = {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            }
        }

        return fetch(`/api/tasks/retrieve/${id}/${item}/retry`, retryRobotItemOption).then((answer) => {
            if (!answer.ok) {
                throw answer
            }
            return;
        }).catch((error) => {
            throw error
        })

    },


    flush() {
        const flushRetrRobotsOption = {
            method: 'DELETE'
        }

        return fetch('/api/tasks/type/retrieve/flush', flushRetrRobotsOption).then(answer => {
            if (!answer.ok) {
                throw answer
            }
            return true
        }).catch(error => {
            throw error
        })
    }

}

export default retrieveRobot