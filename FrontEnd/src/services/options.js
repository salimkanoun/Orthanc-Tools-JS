import {toastifySuccess, toastifyError} from './toastify'

const Options = {

    async setRobotScheduleHour(hour, min){

        fetch('/api/options', {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hour: hour, min: min })
        }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
        }).then(() => {
            toastifySuccess("Done")
        }).catch(error => {
            toastifyError(error.statusText)
        })

    },

    getRobotScheduledHour() {
        return fetch('/api/options')
                    .then((answer) => { return answer.json() })
                    .catch(error => { toastifyError(error.statusText) })
    },

    setOrthancServer(address, port, username, password){

        let postData = {
            OrthancAddress : address,
            OrthancPort : port,
            OrthancUsername : username,
            OrthancPassword : password
        }

        return fetch("/api/options/orthanc-server", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then( (answser) => {
            if(answser.ok) answser.json()
            else throw answser
            })
        .then((answer) => toastifySuccess('Updated'))
        .catch((error) => toastifyError('Failure'))

    },

    async getOrthancServer(){
        return await fetch("/api/options/orthanc-server", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((answer) => {
            return (answer.json())
        }).then( (answer) =>  {return answer} )
    }

}

export default Options