import { toastifyError } from './toastify'

const query = {

    dicomQuery(aet, queryDetails){

      const dicomQueryOption = {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryDetails)
      };

        return fetch("/api/modalities/" + aet + "/query", dicomQueryOption ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch(error => toastifyError(error))
    },

    retrieveAnswer ( orthancIdQuery ) {

      const retrieveAnswerOption =  {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }

        return fetch("/api/queries/" + orthancIdQuery + "/parsedAnswers", retrieveAnswerOption ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch(error => toastifyError(error))
    }
}

export default query