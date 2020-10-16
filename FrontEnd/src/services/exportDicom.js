import { toastifyError } from './toastify'
import downloadjs from 'downloadjs'

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

  async downloadZip(jobID) {

    const url = '/api/jobs/' + jobID + '/archive'
    var x=new XMLHttpRequest();
    x.open( "GET", url , true);
    x.responseType="blob";
    x.onload= function(e){downloadjs(e.target.response, jobID+".zip", "application/zip");};
    x.send();
  }

}

export default exportDicom