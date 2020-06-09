import { SET_MANUAL_QUERY_RETRIEVE_STATUS_SERIES, ADD_MANUAL_QUERY_RESULT_TO_LIST, SET_MANUAL_QUERY_RETRIVE_STATUS_STUDY, ADD_MANUAL_QUERY_SERIES_DETAILS } from '../actions/actions-types'

const initialState = {
  manualQueryResults: []
}

export default function manualQueryReducer (state = initialState, action) {
  switch (action.type) {

    case ADD_MANUAL_QUERY_RESULT_TO_LIST:
      let answers = action.payload
      let newResults = []
      answers.forEach(answer =>{
        newResults.push({
          key: Math.random(),
          isRetrieved: false,
          ...answer,
          StudyOrthancID : '',
          seriesDetails: []
        })
      })

      return {
        manualQueryResults: newResults
      }

    case SET_MANUAL_QUERY_RETRIVE_STATUS_STUDY:
      for (const i in state.manualQueryResults) {
        if (state.results[i].key === action.payload.key) {
          state.results[i].isRetrieved = action.payload.isRetrieved
          break
        }
      }
      return {
        ...state
      }

    case SET_MANUAL_QUERY_RETRIEVE_STATUS_SERIES:
      const newResultArray = state.manualQueryResults.map((studyData) => {
        if (studyData.StudyInstanceUID === action.payload.row.StudyInstanceUID) {
          studyData.seriesDetails.forEach((serieDetails) => {
            if (serieDetails.SeriesInstanceUID === action.payload.row.SeriesInstanceUID) {
              serieDetails.isRetrieved = true
            }
          })
        }
        return studyData
      })
      return {
        ...state,
        manualQueryResults: newResultArray
      }

    case ADD_MANUAL_QUERY_SERIES_DETAILS :
      const seriesDetails = action.payload.seriesDetails
      seriesDetails.forEach((serieItem) => {
        serieItem.isRetrieved = false
        serieItem.key = Math.random()
      })

      const newResultsState = state.manualQueryResults.map((studyData) => {
        if (studyData.StudyInstanceUID === action.payload.StudyInstanceUID) {
          studyData = {
            ...studyData,
            seriesDetails: seriesDetails
          }
        }
        return studyData
      })

      return {
        ...state,
        manualQueryResults: newResultsState
      }

    default :
      return state
  }
}
