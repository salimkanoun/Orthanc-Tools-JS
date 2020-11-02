import { toastifyError } from './toastify'
import streamSaver from 'streamsaver'
streamSaver.mitm = window.location.origin+'/streamSaver/mitm.html'

const exportDicom = {

  exportHirachicalDicoms(OrthancIDsArray, TS) {
    let body = {}
    if (TS !== 'none') {
      body = {
        Synchronous: false,
        Resources: OrthancIDsArray,
        Transcode: TS
      }
    } else {
      body = {
        Synchronous: false,
        Resources: OrthancIDsArray
      }
    }

    const exportHirachicalDicomsOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }

    return fetch('/api/tools/create-archive/', exportHirachicalDicomsOption ).then((answer) => {
      if (!answer.ok) { throw answer }
      return answer.json()
    })
      .catch((error) => {
        toastifyError(error)
      })
  },

  exportDicomDirDicoms(OrthancIDsArray, TS) {
    let body = {}
    if (TS !== 'none') {
      body = {
        Synchronous: false,
        Resources: OrthancIDsArray,
        Transcode: TS
      }
    } else {
      body = {
        Synchronous: false,
        Resources: OrthancIDsArray
      }
    }

    const exportDicomDirDicomsOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }

    return fetch('/api/tools/create-media-extended/', exportDicomDirDicomsOption ).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).catch((error) => {
      toastifyError(error)
    })
  },

  downloadZip(jobID) {
    return fetch('/api/jobs/' + jobID + '/archive', {
        method: 'GET',
        headers: {
            Accept: 'application/zip'
        }

    }).then((answer) => {
        
        if (!answer.ok) throw answer
        const fileStream = streamSaver.createWriteStream('Dicom_'+jobID+'.zip')

        const readableStream = answer.body

        // more optimized
        if (window.WritableStream && readableStream.pipeTo) {
          return readableStream.pipeTo(fileStream)
            .then(() => console.log('done writing'))
        }

        let writer = fileStream.getWriter()

        const reader = answer.body.getReader()
        const pump = () => reader.read()
          .then(res => res.done
            ? writer.close()
            : writer.write(res.value).then(pump))

        pump()

    }).catch((error) => {
        throw error
    })

  }

}

export default exportDicom