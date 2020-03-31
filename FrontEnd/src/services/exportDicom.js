import { toastifyError } from './toastify'

const exportDicom = {

    exportHirachicalDicoms(OrthancIDsArray){

        return fetch('/api/tools/create-archive/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(OrthancIDsArray)
          }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch((error) => {
                toastifyError(error)
            })
    }
}

export default exportDicom