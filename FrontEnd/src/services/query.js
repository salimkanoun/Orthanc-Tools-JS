import axios from "axios";

const query = {

  dicomQuery(aet, queryDetails) {

    return axios.post("/api/modalities/" + aet + "/query", queryDetails).then((answer) =>  answer.data ).catch(error => { throw error })
  },

  retrieveAnswer(orthancIdQuery) {

    return axios.get("/api/queries/" + orthancIdQuery + "/parsedAnswers").then((answer) => answer.data ).catch(error => { throw error })
  }

}

export default query