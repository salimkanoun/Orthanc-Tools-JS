import {
    AQ_ADD_EMPTY_QUERY,
    AQ_ADD_QUERY_TO_LIST,
    AQ_EDIT_CELL_QUERY,
    AQ_EDIT_COLUMN_QUERY,
    AQ_EMPTY_QUERY,
    AQ_REMOVE_QUERY
} from './actions-types'

export function addRow() {
    return {
        type: AQ_ADD_EMPTY_QUERY
    }
}

export function addQueryToList(query) {
    return {
        type: AQ_ADD_QUERY_TO_LIST,
        payload: query
    }
}

export function editColumnQuery(columnName, text) {
    return {
        type: AQ_EDIT_COLUMN_QUERY,
        payload: {
            columnName: columnName,
            text: text
        }
    }
}

export function editCellQuery(key, column, value) {
    return {
        type: AQ_EDIT_CELL_QUERY,
        payload: {
            column,
            value,
            key,
        }
    }
}


export function removeQuery(lineNumber) {
    return {
        type: AQ_REMOVE_QUERY,
        payload: lineNumber
    }
}

export function emptyQueryTable() {
    return {
        type: AQ_EMPTY_QUERY
    }
}


