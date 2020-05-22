import { AQ_ADD_STUDY_RESULT, AQ_ADD_SERIES_DETAILS, AQ_REMOVE_STUDY_RESULT, AQ_REMOVE_SERIES_RESULT, AQ_EMPTY_RESULTS } from '../actions/actions-types'

const initialState = {
  results: {},
  resultsSeries : {}
}

export default function retrieveListReducer (state = initialState, action) {
  switch (action.type) {

    case AQ_ADD_STUDY_RESULT:
      const studyInstanceUid = action.payload.studyInstanceUID;
      let newResultObject = {...state.results}

      newResultObject[studyInstanceUid]= {
        isRetrieved: false,
        ...action.payload,
        seriesDetails: []
      }

      return {
        ...state,
        results : newResultObject
      }
    
    case AQ_REMOVE_STUDY_RESULT :
      let resultsCopy = {...state.results}

      const removedLines = action.payload
      removedLines.forEach(studyInstanceUID =>{
          delete resultsCopy[studyInstanceUID]
      })
      return {
        results: resultsCopy
      }

    case AQ_EMPTY_RESULTS :
      return {
        ...state,
        results: []
      }

    case AQ_ADD_SERIES_DETAILS :
      console.log(action.payload)
      const seriesDetails = action.payload.seriesDetails
      seriesDetails.forEach((serieItem) => {
        serieItem.isRetrieved = false
      })

      let resultSeriesCopy = {...state.resultsSeries}
      seriesDetails.forEach(series =>{
        resultSeriesCopy[series.seriesInstanceUID] = {...series}
      })

      return {
        ...state,
        resultsSeries: resultSeriesCopy
      }

    case AQ_REMOVE_SERIES_RESULT :
      
      let resultSeriesCopy2 = {...seriesDetails}
      delete resultSeriesCopy2[action.payload.seriesInstanceUID]

      return {
        ...state,
        resultsSeries: resultSeriesCopy2
      }


    default :
      return state
  }
}
