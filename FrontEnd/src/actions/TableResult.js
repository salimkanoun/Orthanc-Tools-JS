import { AQ_REMOVE_STUDY_RESULT, AQ_ADD_STUDY_RESULT, AQ_EMPTY_RESULTS_STUDY_SERIES, AQ_ADD_SERIES_DETAILS, AQ_REMOVE_SERIES_RESULT } from './actions-types'

export function removeResult(lineNumber) {
  return {
    type: AQ_REMOVE_STUDY_RESULT,
    payload: lineNumber
  }
}

export function addStudyResult(resultData) {
  return {
    type: AQ_ADD_STUDY_RESULT,
    payload: {
      ...resultData
    }
  }
}

export function emptyResultsTable() {
  return {
    type: AQ_EMPTY_RESULTS_STUDY_SERIES
  }
}

export function addSeriesDetails(seriesDetails, studyInstanceUID) {
  return {
    type: AQ_ADD_SERIES_DETAILS,
    payload: { seriesDetails, studyInstanceUID }
  }
}

export function removeSeriesResult(seriesInstanceUIDArray) {
  return {
    type: AQ_REMOVE_SERIES_RESULT,
    payload: seriesInstanceUIDArray
  }
}
