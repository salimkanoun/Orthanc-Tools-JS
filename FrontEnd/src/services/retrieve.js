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

    return axios.post('/api/retrieve', payload).then((answer) => answer.data
    ).catch(error => {
      throw error
    })
  }

}

export default retrieve