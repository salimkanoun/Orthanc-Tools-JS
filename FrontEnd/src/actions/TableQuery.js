import { AQ_ADD_QUERY_TO_LIST, AQ_REMOVE_QUERY, AQ_ADD_EMPTY_QUERY, AQ_EMPTY_QUERY, AQ_EDIT_COLUMN_QUERY } from './actions-types'

export function addRow () {
  return {
    type: AQ_ADD_EMPTY_QUERY
  }
}

export function addQueryToList (query) {
  return {
    type: AQ_ADD_QUERY_TO_LIST,
    payload: query
  }
}

export function editColumnQuery (columnName, text) {
  return {
    type: AQ_EDIT_COLUMN_QUERY,
    payload: {
      columnName: columnName,
      text: text
    }
  }
}

export function removeQuery (lineNumber) {
  return {
    type: AQ_REMOVE_QUERY,
    payload: lineNumber
  }
}

export function emptyQueryTable () {
  return {
    type: AQ_EMPTY_QUERY
  }
}


