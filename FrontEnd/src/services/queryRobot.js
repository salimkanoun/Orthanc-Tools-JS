import { toastifySuccess, toastifyError } from './toastify'

const queryRobot = {

    createRobot(username, projectName, retrieveArray){
        return fetch('/api/robot/'+username+'/retrieve', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                    projectName: projectName, 
                    retrieveArray: retrieveArray 
                })
        }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).then(() => toastifySuccess('Sent To Retrieve Robot'))
        .catch((error) => {
            toastifyError(error)
        })

    },

    validateRobot(username){
        return fetch("/api/robot/"+username+"/retrieve/validate", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })
    },

    deleteRobot(username){
        return fetch("/api/robot/"+username+"/retrieve", {
            method: "DELETE",
        }).catch((error) => {
            toastifyError(error)
        })
    },

    getAllRobotsDetails(){
        return fetch("/api/robot/retrieve", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })
    },

    getRobotDetails(username){
        return fetch( "/api/robot/"+username+"/retrieve", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })
    },

    deleteRobotItem(username, item){

        return fetch("/api/robot/"+username+"/retrieve/"+item, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })

    }

}

export default queryRobot