import { RETRIEVE, REMOVE_RESULT, ADD_RESULT_TO_LIST, SET_RETRIVE_STATUS_STUDY, EMPTY_RESULTS } from './actions-types'

export function retrive (data) {
  return {
    type: RETRIEVE,
    payload: data
  }
}

export function removeResult (lineNumber) {
  return {
    type: REMOVE_RESULT,
    payload: lineNumber
  }
}

export function addResult (resultData) {
  return {
    type: ADD_RESULT_TO_LIST,
    payload: resultData
  }
}

export function setRetrieveStatus (key, isRetrieved) {
  return {
    type: SET_RETRIVE_STATUS_STUDY,
    payload: { key, isRetrieved }
  }
}

export function emptyResultsTable(){
  return {
    type : EMPTY_RESULTS
  }
}
