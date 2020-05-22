import { AQ_REMOVE_STUDY_RESULT, AQ_ADD_STUDY_RESULT, AQ_EMPTY_RESULTS, AQ_ADD_SERIES_DETAILS } from '../actions/actions-types'

const initialState = {
  results: []
}

export default function retrieveListReducer (state = initialState, action) {
  switch (action.type) {
    
    case AQ_REMOVE_STUDY_RESULT :
      const removedLines = action.payload
      const newResults = state.results.filter(function (results) {
        return !removedLines.includes(results.key)
      })
      return {
        ...state,
        results: newResults
      }

    case AQ_ADD_STUDY_RESULT:
      let maxKey = Math.max.apply(Math, state.results.map(function (query) { return query.key }))
      maxKey = Math.max(0, maxKey)
      let resultsCopy = [...state.results]
      resultsCopy.push({
        key: (maxKey + 1),
        isRetrieved: false,
        ...action.payload,
        seriesDetails: []
      })
      return {
        ...state,
        results : resultsCopy
      }

    case AQ_EMPTY_RESULTS :
      return {
        ...state,
        results: []
      }

    case AQ_ADD_SERIES_DETAILS :
      const seriesDetails = action.payload.seriesDetails
      seriesDetails.forEach((serieItem) => {
        serieItem.isRetrieved = false
        serieItem.key = Math.random()
      })

      const newResultsState = state.results.map((studyData) => {
        if (studyData.studyInstanceUID === action.payload.studyInstanceUID) {
          studyData = {
            ...studyData,
            seriesDetails: seriesDetails
          }
        }
        return studyData
      })

      return {
        ...state,
        results: newResultsState
      }

    default :
      return state
  }
}
