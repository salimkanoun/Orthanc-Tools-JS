import { toastifySuccess, toastifyError } from './toastify'

const retrieveRobot = {

    createRobot(username, projectName, retrieveArray){

        const createRobotOption =  {
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

        return fetch('/api/robot/'+username+'/retrieve', createRobotOption ).then((answer) => {
            if (!answer.ok) { throw answer.status + ' : ' + answer.text() }
            return (answer.json())
        }).then(() => toastifySuccess('Sent To Retrieve Robot'))
        .catch((error) => {
            toastifyError(error)
        })

    },

    validateRobot(username){

        const validateRobotOption = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch("/api/robot/"+username+"/retrieve/validate", validateRobotOption ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })
    },

    deleteRobot(username){

        const deleteRobotOption = {
            method: "DELETE",
        }

        return fetch("/api/tasks/"+username+"/retrieve", deleteRobotOption ).catch((error) => {
            toastifyError(error)
        })
    },

    getAllRobotsDetails(){

        const getAllRobotsDetails =  {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch("/api/robot/retrieve", getAllRobotsDetails ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })
    },

    getRobotDetails(username){

        const getRobotDetailsOption =  {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch( "/api/robot/"+username+"/retrieve", getRobotDetailsOption ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })
    },

    deleteRobotItem(username, item){

        const deleteRobotItemOption =  {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch("/api/robot/"+username+"/retrieve/"+item, deleteRobotItemOption ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })

    }

}

export default retrieveRobot