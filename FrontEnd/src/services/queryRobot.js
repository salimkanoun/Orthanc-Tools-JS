import { toastifySuccess, toastifyError } from './toastify'
import updateOptions from '../authorizedOption'

const queryRobot = {

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

        return fetch('/api/robot/'+username+'/retrieve', updateOptions(createRobotOption) ).then((answer) => {
            if (!answer.ok) { throw answer }
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

        return fetch("/api/robot/"+username+"/retrieve/validate", updateOptions(validateRobotOption) ).then((answer) => {
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

        return fetch("/api/robot/"+username+"/retrieve", updateOptions(deleteRobotOption) ).catch((error) => {
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

        return fetch("/api/robot/retrieve", updateOptions(getAllRobotsDetails) ).then((answer) => {
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

        return fetch( "/api/robot/"+username+"/retrieve", updateOptions(getRobotDetailsOption) ).then((answer) => {
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

        return fetch("/api/robot/"+username+"/retrieve/"+item, updateOptions(deleteRobotItemOption) ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).catch((error) => {
            toastifyError(error)
        })

    }

}

export default queryRobot