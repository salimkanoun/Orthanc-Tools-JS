import { REMOVE_RESULT, ADD_RESULT_TO_LIST, SET_RETRIVE_STATUS_STUDY, EMPTY_RESULTS, ADD_SERIES_DETAILS, SET_RETRIEVE_STATUS_SERIES } from './actions-types'


export function removeResult (lineNumber) {
  return {
    type: REMOVE_RESULT,
    payload: lineNumber
  }
}

export function addStudyResult (resultData) {
  return {
    type: ADD_RESULT_TO_LIST,
    payload: {
      ...resultData
    }
  }
}

export function setRetrieveStatus (row, isRetrieved) {
  console.log('row data')
  console.log(row)
  if (row.level === 'STUDY'){
    return {
      type: SET_RETRIVE_STATUS_STUDY,
      payload: { key : row.key, isRetrieved : isRetrieved }
    }

  } else if ( row.level === 'SERIES'){
    return {
      type: SET_RETRIEVE_STATUS_SERIES,
      payload: { row : row, isRetrieved : isRetrieved }
    }

  }
  
}

export function emptyResultsTable () {
  return {
    type: EMPTY_RESULTS
  }
}

export function addSeriesDetails (seriesDetails, studyInstanceUID) {
  return {
    type : ADD_SERIES_DETAILS,
    payload : {seriesDetails, studyInstanceUID}
  }
}
