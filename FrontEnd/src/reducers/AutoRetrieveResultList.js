
import { AQ_ADD_STUDY_RESULT, AQ_ADD_SERIES_DETAILS, AQ_REMOVE_STUDY_RESULT, AQ_REMOVE_SERIES_RESULT, AQ_EMPTY_RESULTS, AQ_ADD_STUDY_RESULT_FILTERED, AQ_ADD_SERIES_RESULT_FILTERED, AQ_SAVE_FILTERS } from '../actions/actions-types'


const initialState = {
  results: {},
  resultsSeries: {},
  resultsStudiesFiltered: [],
  resultsSeriesFiltered: [], 
  filters: {}
}

export default function retrieveListReducer(state = initialState, action) {
  switch (action.type) {

    case AQ_ADD_STUDY_RESULT:
      const StudyInstanceUid = action.payload.StudyInstanceUID;
      let newResultObject = { ...state.results }

      newResultObject[StudyInstanceUid] = {
        ...action.payload
      }

      return {
        ...state,
        results: newResultObject
      }

    case AQ_ADD_STUDY_RESULT_FILTERED:
      const studyInstanceUIDFiltered = action.payload

      return {
        ...state,
        resultsStudiesFiltered: studyInstanceUIDFiltered
      }

    case AQ_REMOVE_STUDY_RESULT:
      let resultsCopy = { ...state.results }
      //Remove selected studies from studies object
      const removedLines = action.payload
      removedLines.forEach(StudyInstanceUID => {
        delete resultsCopy[StudyInstanceUID]
      })

      //Remove child series of these studies
      let resultSeriesCopy3 = { ...state.resultsSeries }
      let existingSeriesUID = Object.keys(resultSeriesCopy3)
      existingSeriesUID.forEach(seriesUID => {
        if (!removedLines.includes(seriesUID)) {
          delete resultSeriesCopy3[seriesUID]
        }
      })

      return {
        ...state,
        resultsSeries: resultSeriesCopy3,
        results: resultsCopy
      }

    case AQ_EMPTY_RESULTS:
      return {
        ...state,
        results: [],
        resultsSeries: [],
      }

    case AQ_ADD_SERIES_DETAILS:
      const seriesDetails = action.payload.seriesDetails

      let resultSeriesCopy = { ...state.resultsSeries }
      seriesDetails.forEach(series => {
        resultSeriesCopy[series.SeriesInstanceUID] = {
          ...series
        }
      })

      return {
        ...state,
        resultsSeries: resultSeriesCopy
      }

    case AQ_ADD_SERIES_RESULT_FILTERED:
      const seriesDetailsFiltered = action.payload
      return {
        ...state,
        resultsSeriesFiltered: seriesDetailsFiltered
      }

    case AQ_REMOVE_SERIES_RESULT:
      //SK ICI A REVOIR
      let seriesUIDToDelete = action.payload

      let resultSeriesCopy2 = { ...state.resultsSeries }
      //Remove series from series Object
      seriesUIDToDelete.forEach(seriesUID => {
        delete resultSeriesCopy2[seriesUID]
      })
      //List remaining StudyUID in this new list
      let remainingStudyUIDInSeries = Object.keys(resultSeriesCopy2).map(seriesUID => {
        return resultSeriesCopy2[seriesUID]['StudyInstanceUID']
      })
      //Get unique remaining StudyUID
      remainingStudyUIDInSeries = [...new Set(remainingStudyUIDInSeries)]

      let resultStudiesCopy = { ...state.results }
      let studyUIDArray = Object.keys(resultStudiesCopy)
      let studiesUIDToRemove = studyUIDArray.filter(studyUID => !remainingStudyUIDInSeries.includes(studyUID));
      studiesUIDToRemove.forEach(studyUID => {
        delete resultStudiesCopy[studyUID]
      })

      return {
        ...state,
        results: resultStudiesCopy,
        resultsSeries: resultSeriesCopy2
      }
    
    case AQ_SAVE_FILTERS:
      const {ID, array} = action.payload
      return {
        ...state, 
        filters: {
          ...state.filters, 
          [ID]: array
        }
      }
    default:
      return state
  }

}
