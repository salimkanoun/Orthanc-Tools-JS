import { ADD_QUERY_RESULT_TO_LIST } from './actions-types'

export function addResultsToList (results) {
  return {
    type: ADD_QUERY_RESULT_TO_LIST,
    payload: results
  }
}
