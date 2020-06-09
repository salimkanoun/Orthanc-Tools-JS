import { SET_MANUAL_QUERY_RETRIEVE_STATUS_SERIES, ADD_MANUAL_QUERY_RESULT_TO_LIST, SET_MANUAL_QUERY_RETRIVE_STATUS_STUDY, ADD_MANUAL_QUERY_SERIES_DETAILS } from './actions-types';

export function addManualQueryStudyResult (resultData) {
  return {
    type: ADD_MANUAL_QUERY_RESULT_TO_LIST,
    payload: resultData
  }
}

export function setManualQueryRetrieveStatus (row, isRetrieved) {
  if (row.level === 'STUDY') {
    return {
      type: SET_MANUAL_QUERY_RETRIVE_STATUS_STUDY,
      payload: { key: row.key, isRetrieved: isRetrieved }
    }
  } else if (row.level === 'SERIES') {
    return {
      type: SET_MANUAL_QUERY_RETRIEVE_STATUS_SERIES,
      payload: { row: row, isRetrieved: isRetrieved }
    }
  }
}

export function addManualQuerySeriesDetails (seriesDetails, StudyInstanceUID) {
  return {
    type: ADD_MANUAL_QUERY_SERIES_DETAILS,
    payload: { seriesDetails, StudyInstanceUID }
  }
}
