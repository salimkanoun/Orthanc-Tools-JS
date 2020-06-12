import { AQ_REMOVE_STUDY_RESULT, AQ_ADD_STUDY_RESULT, AQ_EMPTY_RESULTS, AQ_ADD_SERIES_DETAILS, AQ_REMOVE_SERIES_RESULT, AQ_ADD_STUDY_RESULT_FILTERED, AQ_ADD_SERIES_RESULT_FILTERED, AQ_SAVE_FILTERS } from './actions-types'

export function removeResult (lineNumber) {
  return {
    type: AQ_REMOVE_STUDY_RESULT,
    payload: lineNumber
  }
}

export function addStudyResult (resultData) {
  return {
    type: AQ_ADD_STUDY_RESULT,
    payload: {
      ...resultData
    }
  }
}

export function addStudiesFiltered(fileredStudiesArray){
  return {
    type: AQ_ADD_STUDY_RESULT_FILTERED, 
    payload: fileredStudiesArray
  }
}

export function emptyResultsTable () {
  return {
    type: AQ_EMPTY_RESULTS
  }
}

export function addSeriesDetails (seriesDetails, studyInstanceUID) {
  return {
    type: AQ_ADD_SERIES_DETAILS,
    payload: { seriesDetails, studyInstanceUID }
  }
}

export function addSeriesFiltered (fileredSeriesArray){
  return {
    type: AQ_ADD_SERIES_RESULT_FILTERED,
    payload: fileredSeriesArray
  }
}

export function removeSeriesResult(seriesInstanceUIDArray){
  return {
    type: AQ_REMOVE_SERIES_RESULT,
    payload: seriesInstanceUIDArray
  }
}

export function saveFilters(ID, array){
  return {
    type: AQ_SAVE_FILTERS, 
    payload: {ID, array}
  }
}
