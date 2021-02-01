const retrieveRobot = {

    createRobot(username, projectName, retrieveArray) {

        const createRobotOption = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
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
            return true
        }).catch((error) => {
            throw error
        })

    },

    validateRobot(username) {

        const validateRobotOption = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch("/api/tasks/" + username + "/retrieve/validate", validateRobotOption).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        })
    },

    deleteRobot(username) {

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
                'Content-Type': 'application/json'
            }
        }

        return fetch("/api/tasks/retrieve", getAllRobotsDetails).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        })
    },

    deleteRobotItem(username, item) {

        const deleteRobotItemOption = {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch("/api/tasks/" + username + "/retrieve/" + item, deleteRobotItemOption).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            throw error
        })

    }

}

export default retrieveRobot