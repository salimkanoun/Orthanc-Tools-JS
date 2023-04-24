import axios from 'axios'
import { toast } from 'react-toastify'
import { showSaveFilePicker } from 'native-file-system-adapter'

import { getToken } from './axios';

const exportFileThroughFilesystemAPI = async (
  readableStream,
  mimeType,
  suggestedName,
  showProgress,
  abortController = { abort: () => { } }
) => {
  let acceptedTypes = []

  let extension = suggestedName.split('.').pop()
  acceptedTypes.push({ accept: { [mimeType]: ['.' + extension] } })

  const fileHandle = await showSaveFilePicker({
    _preferPolyfill: true,
    suggestedName: suggestedName,
    types: acceptedTypes,
    excludeAcceptAllOption: false // default
  }).catch((err) => console.log(err))

  let writableStream = await fileHandle.createWritable()

  if (showProgress) {
    let loaded = 0
    let toastId = toast.info('Download Progress', {
      closeButton: true,
      containerId: 'message'
    })

    const unsubscribe = toast.onChange((payload) => {
      if (payload.status === 'removed' && payload.id === toastId) {
        abortController.abort()
      }
    })

    let progress = new TransformStream({
      transform(chunk, controller) {
        loaded += chunk.length
        let progressMb = Math.round(loaded / 1000000)

        if (progressMb > 1) {
          toast.update(toastId, {
            render: 'Download Progress ' + progressMb + ' Mb',
            closeButton: true,
            containerId: 'message'
          })
        }
        controller.enqueue(chunk)
      }
    })
    await readableStream.pipeThrough(progress).pipeTo(writableStream)
    unsubscribe()
  } else {
    await readableStream.pipeTo(writableStream)
  }
}

const exportDicom = {

  getContentDispositionFilename(headers) {
    const contentDisposition = headers.get('Content-Disposition')
    const parts = contentDisposition?.split(';')
    if (parts) {
      return parts[1].split('=')[1]
    } else {
      return null
    }
  },

  getContentType(headers) {
    const contentType = headers.get('Content-Type')
    const parts = contentType?.split(',')
    return parts?.[0]
  },

  exportHirachicalDicoms(OrthancIDsArray, TS) {

    let payload = {
      Asynchronous: false,
      Resources: OrthancIDsArray
    }
    if (TS !== 'None' && TS != null) {
      payload.Transcode = TS
    }

    let abortController = new AbortController()
    return fetch('/api/tools/create-archive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getToken()
      },
      body: JSON.stringify(payload),
      signal: abortController.signal
    }).then((answer) => {
      if (!answer.ok) throw answer
      let contentType = this.getContentType(answer.headers)
      const readableStream = answer.body
      let filename = this.getContentDispositionFilename(answer.headers) ?? crypto.randomUUID()+".zip"
      exportFileThroughFilesystemAPI(
        readableStream,
        contentType,
        filename,
        true,
        abortController
      )
    }).catch((error) => {
      throw error
    })
  },

  exportDicomDirDicoms(OrthancIDsArray, TS) {
    let body = {
      Asynchronous: false,
      Resources: OrthancIDsArray
    }
    if (TS !== 'None' && TS != null) {
      body.Transcode = TS
    }

    let abortController = new AbortController()
    return fetch('/api/tools/create-media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getToken()
      },
      body: JSON.stringify(body),
      signal: abortController.signal
    }).then((answer) => {
      if (!answer.ok) throw answer
      let contentType = this.getContentType(answer.headers)
      const readableStream = answer.body
      let filename = this.getContentDispositionFilename(answer.headers) ?? crypto.randomUUID()+".zip"
      exportFileThroughFilesystemAPI(
        readableStream,
        contentType,
        filename,
        true,
        abortController
      )
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

