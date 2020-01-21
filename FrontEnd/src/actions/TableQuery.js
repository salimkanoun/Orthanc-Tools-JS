import { REMOVE_QUERY, ADD_EMPTY_QUERY, EMPTY_QUERY, EDIT_COLUMN_QUERY } from './actions-types'

export function removeQuery(lineNumber) {
  return {
    type: REMOVE_QUERY,
    payload: lineNumber
  }
}

export function addRow() {
  return {
    type: ADD_EMPTY_QUERY
  }
}

export function emptyQueryTable() {
  return {
    type: EMPTY_QUERY
  }
}

export function editColumnQuery(columnName, text) {
  return {
    type: EDIT_COLUMN_QUERY,
    payload: {
      columnName: columnName,
      text: text
    }
  }
}
