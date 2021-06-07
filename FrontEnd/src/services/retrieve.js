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
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    }

    return fetch('/api/retrieve', retrieveByUIDOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).catch(error => {
      throw error
    })
  }
  
}

export default retrieve