import { toastifyError } from './toastify'

const query = {

    dicomQuery(aet, queryDetails){

        return fetch("/api/modalities/" + aet + "/query", {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(queryDetails)
          }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch(error => toastifyError(error))
    },

    retrieveAnswer ( orthancIdQuery ) {
        return fetch("/api/queries/" + orthancIdQuery + "/parsedAnswers", {
            method: "GET",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch(error => toastifyError(error))
    }
}

export default query