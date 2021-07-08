const query = {

  dicomQuery(aet, queryDetails) {

    const dicomQueryOption = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(queryDetails)
    };

    return fetch("/api/modalities/" + aet + "/query", dicomQueryOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).catch(error => { throw error })
  },

  retrieveAnswer(orthancIdQuery) {

    const retrieveAnswerOption = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    return fetch("/api/queries/" + orthancIdQuery + "/parsedAnswers", retrieveAnswerOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).catch(error => { throw error })
  }
  
}

export default query