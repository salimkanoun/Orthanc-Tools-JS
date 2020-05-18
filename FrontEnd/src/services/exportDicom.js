import { toastifyError } from './toastify'
import streamSaver from 'streamsaver'

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
        body: JSON.stringify({
          Synchronous : false,
          Resources : OrthancIDsArray
        })
      }).then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())
      }).catch((error) => {
            toastifyError(error)
      })
    },

    async downloadZip(jobID){

      const url = '/api/jobs/'+jobID+'/archive'
      const fileStream = streamSaver.createWriteStream( jobID+".zip")

      fetch(url).then(res => {
        const readableStream = res.body
        
        if (window.WritableStream && readableStream.pipeTo) {
          return readableStream.pipeTo(fileStream)
            .then(() => console.log('done writing'))
        }

        let writer = fileStream.getWriter()

        const reader = res.body.getReader()
        const pump = () => reader.read()
          .then(res => res.done
            ? writer.close()
            : writer.write(res.value).then(pump))

        pump()
      })

    }

}

export default exportDicom