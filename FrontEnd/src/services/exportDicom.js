import { toastifyError } from './toastify'
const download = require('download');

const exportDicom = {

    exportHirachicalDicoms(OrthancIDsArray){

        return fetch('/api/tools/create-archive/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              Synchronous : true,
              Resources : OrthancIDsArray
            })
          }).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.blob())
          })
          .then(blob => download(blob))
          .catch((error) => {
                toastifyError(error)
            })
    },

    exportDicomDirDicoms( OrthancIDsArray ){
      return fetch('/api/tools/create-media-extended/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Synchronous : true,
          Resources : OrthancIDsArray
        })
      }).then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.blob())
      })
      .then(blob => download(blob))
      .catch((error) => {
            toastifyError(error)
        })
    }
}

export default exportDicom