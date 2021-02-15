import streamSaver from 'streamsaver'
import { WritableStream } from "web-streams-polyfill/ponyfill";
streamSaver.mitm = window.location.origin + '/streamSaver/mitm.html'
streamSaver.WritableStream = WritableStream

const exportDicom = {

  exportHirachicalDicoms(OrthancIDsArray, TS) {

    let body = {}
    if (TS !== 'None') {
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

    return fetch('/api/tools/create-archive/', exportHirachicalDicomsOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return answer.json()
    }).catch((error) => {
      throw error
    })
  },

  exportDicomDirDicoms(OrthancIDsArray, TS) {
    let body = {}
    if (TS !== 'None') {
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

    return fetch('/api/tools/create-media-extended/', exportDicomDirDicomsOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).catch((error) => {
      throw error
    })
  },

  downloadZip(jobID) {

    const fileStream = streamSaver.createWriteStream('Dicom_' + jobID + '.zip')

    return fetch('/api/jobs/' + jobID + '/archive', {
      method: 'GET',
      headers: {
        Accept: 'application/zip'
      }

    }).then((answer) => {

      if (!answer.ok) throw answer

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

  },

  exportStudiesToExternal(username, orthancIDsArray, endpoint) {
    const storeFtpOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Resources: orthancIDsArray,
        endpoint: endpoint
      })
    }

    return fetch('/api/tasks/' + username + '/export/', storeFtpOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.text())
    }).catch(error => {
        throw error
    })
  }

}

export default exportDicom