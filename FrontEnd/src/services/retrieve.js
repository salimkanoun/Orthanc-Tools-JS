import axios from "axios"

const retrieve = {

  retrieveByUID(aet, studyInstanceUID, seriesInstanceUID = null) {

    let payload = {
      StudyInstanceUID: studyInstanceUID,
      Aet: aet
    }

    if (seriesInstanceUID !== null) {
      payload.SeriesInstanceUID = seriesInstanceUID
    }

    var retrieveByUIDOption = {
      method: 'POST',
      body: JSON.stringify(payload)
    }

    return axios.post('/api/retrieve', retrieveByUIDOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).catch(error => {
      throw error
    })
  }
  
}

export default retrieve