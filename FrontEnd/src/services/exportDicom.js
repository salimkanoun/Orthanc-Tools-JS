import { toastifyError } from './toastify'
import download from 'downloadjs'

const exportDicom = {

    exportHirachicalDicoms(OrthancIDsArray){
        return fetch('/api/tools/create-archive/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              Synchronous : false,
              Resources : OrthancIDsArray
            })
          }).then((answer) => {
            if (!answer.ok) { throw answer }
            return answer.json()
          })
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
        body: JSON.stringify(OrthancIDsArray)
      }).then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      }).catch((error) => {
            toastifyError(error)
      })
    },

    downloadZip(jobID){
      return fetch('/api/jobs/'+jobID+'/archive')
        .then(answer => answer.blob() )
        .then( blob =>{ download(blob, "dicom.zip")})
    }

}

export default exportDicom