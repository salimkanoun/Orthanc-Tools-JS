import axios from 'axios';
import streamSaver from 'streamsaver'
import { WritableStream } from "web-streams-polyfill/ponyfill";
streamSaver.mitm = window.location.origin + '/streamSaver/mitm.html'
streamSaver.WritableStream = WritableStream

const exportDicom = {

  exportHirachicalDicoms(OrthancIDsArray, TS) {

    let body = {}
    if (TS !== 'None' && TS !=null) {
      body = {
        Asynchronous: false,
        Resources: OrthancIDsArray,
        Transcode: TS
      }
    } else {
      body = {
        Asynchronous: false,
        Resources: OrthancIDsArray
      }
    }

    return axios.post('/api/tools/create-archive/', body).catch((error) => {
      throw error
    })
  },

  exportDicomDirDicoms(OrthancIDsArray, TS) {
    let body = {}
    if (TS !== 'None' && TS !=null) {
      body = {
        Asynchronous: false,
        Resources: OrthancIDsArray,
        Transcode: TS
      }
    } else {
      body = {
        Asynchronous: false,
        Resources: OrthancIDsArray
      }
    }

    return axios.post('/api/tools/create-media-extended/', body).catch((error) => {
      throw error
    })
  },


  downloadZipSync(orthancIDsArray, TS, dicomDir) {

    let fetchPromise = null
    if (dicomDir) {
      fetchPromise = this.exportDicomDirDicoms(orthancIDsArray, TS)
    } else {
      fetchPromise = this.exportHirachicalDicoms(orthancIDsArray, TS)
    }

    fetchPromise.then((answer) => {

      const fileStream = streamSaver.createWriteStream('Dicom_' + Date.now() + '.zip')

      console.log("ici reponse recue")

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

    return axios.get('/api/jobs/' + jobID + '/archive')
      .then((answer) => {

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

    return axios.post('/api/tasks/' + username + '/export/', {
      Resources: orthancIDsArray,
      endpoint: endpoint
    }).then((answer) => {
      return (answer.data)
    }).catch(error => {
      throw error
    })
  },

  flushExternalExport() {

    return axios.delete('/api/tasks/type/export/flush').then(answer => {
      return true
    }).catch(error => {
      throw error
    })
  }

}

export default exportDicom