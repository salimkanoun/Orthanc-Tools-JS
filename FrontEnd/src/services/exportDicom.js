import streamSaver from 'streamsaver'
import { WritableStream } from "web-streams-polyfill/ponyfill";
streamSaver.mitm = window.location.origin + '/streamSaver/mitm.html'
streamSaver.WritableStream = WritableStream

const exportDicom = {

  exportHirachicalDicoms(OrthancIDsArray, TS) {

    let body = { }
    if (TS !== 'None') {
      body = {
        Synchronous: true,
        Resources: OrthancIDsArray,
        Transcode: TS
      }
    } else {
      body = {
        Synchronous: true,
        Resources: OrthancIDsArray
      }
    }

    const exportHirachicalDicomsOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    }

    return fetch('/api/tools/create-archive/', exportHirachicalDicomsOption).catch((error) => {
      throw error
    })
  },

  exportDicomDirDicoms(OrthancIDsArray, TS) {
    let body = {}
    if (TS !== 'None') {
      body = {
        Synchronous: true,
        Resources: OrthancIDsArray,
        Transcode: TS
      }
    } else {
      body = {
        Synchronous: true,
        Resources: OrthancIDsArray
      }
    }

    const exportDicomDirDicomsOption = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    }

    return fetch('/api/tools/create-media-extended/', exportDicomDirDicomsOption).catch((error) => {
      throw error
    })
  },


  downloadZipSync(orthancIDsArray, TS, dicomDir) {

    let fetchPromise = null
    if(dicomDir){
      fetchPromise = this.exportDicomDirDicoms(orthancIDsArray, TS)
    }else{
      fetchPromise = this.exportHirachicalDicoms(orthancIDsArray, TS)
    }

    fetchPromise.then( (answer) => {

      const fileStream = streamSaver.createWriteStream('Dicom_' + Date.now() + '.zip')

      console.log("ici reponse recue")

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
        'Content-Type': 'application/json; charset=utf-8'
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
  },

  flushExternalExport(){
    const flushExpoRobotsOption = {
        method: 'DELETE'
    }

    return fetch('/api/tasks/type/export/flush', flushExpoRobotsOption ).then(answer => {
        if (!answer.ok) {throw answer}
        return true
    }).catch(error => {
        throw error
    })
}

}

export default exportDicom