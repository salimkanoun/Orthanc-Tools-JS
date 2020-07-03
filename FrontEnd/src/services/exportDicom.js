import { toastifyError } from './toastify'
import streamSaver from 'streamsaver'
import updateOptions from '../authorizedOption'

const exportDicom = {

    exportHirachicalDicoms(OrthancIDsArray, TS){
      let body = {}
      if (TS !== 'none') {
        body = {
          Synchronous : false,
          Resources : OrthancIDsArray, 
          Transcode: TS
        }
      } else {
        body = {
          Synchronous : false,
          Resources : OrthancIDsArray
        }
      }

        const exportHirachicalDicomsOption =  {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }

        return fetch('/api/tools/create-archive/', updateOptions(exportHirachicalDicomsOption) ).then((answer) => {
            if (!answer.ok) { throw answer }
            return answer.json()
          })
          .catch((error) => {
                toastifyError(error)
          })
    },

    exportDicomDirDicoms( OrthancIDsArray, TS ){
      let body = {}
      if (TS !== 'none') {
        body = {
          Synchronous : false,
          Resources : OrthancIDsArray, 
          Transcode: TS
        }
      } else {
        body = {
          Synchronous : false,
          Resources : OrthancIDsArray
        }
      }

      const exportDicomDirDicomsOption =  {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }

      return fetch('/api/tools/create-media-extended/', updateOptions(exportDicomDirDicomsOption) ).then((answer) => {
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