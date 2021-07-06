import {
    AQ_ADD_EMPTY_QUERY,
    AQ_ADD_QUERY_TO_LIST,
    AQ_EDIT_CELL_QUERY,
    AQ_EDIT_COLUMN_QUERY,
    AQ_EMPTY_QUERY,
    AQ_REMOVE_QUERY
} from '../actions/actions-types'

const initialState = {
    queries: []
}

export default function queryListReducer(state = initialState, action) {
    switch (action.type) {

        case AQ_ADD_QUERY_TO_LIST:
            let queriesListCopy = [...state.queries]
            queriesListCopy.push({
                key: Math.random(),
                ...action.payload
            })
            return {
                ...state,
                queries: queriesListCopy
            }

        case AQ_ADD_EMPTY_QUERY:
            let queriesCopy = [...state.queries]
            queriesCopy.push({
                key: Math.random(),
                PatientName: '',
                PatientID: '',
                AccessionNumber: '',
                DateFrom: '',
                DateTo: '',
                StudyDescription: '',
                ModalitiesInStudy: '',
                Aet: ''

            })
            return {
                ...state,
                queries: queriesCopy
            }

        case AQ_REMOVE_QUERY:
            const removedLines = action.payload
            const newQueries = state.queries.filter((query) => {
                return !removedLines.includes(query.key)
            })
            return {
                ...state,
                queries: newQueries
            }

        case AQ_EMPTY_QUERY:
            return {
                ...state,
                queries: []
            }

        case AQ_EDIT_COLUMN_QUERY:
            // Edit all column value
            // Need to change key to force update
            const newState = state.queries.map((query) => {
                query.key = Math.random()
                query[action.payload.columnName] = action.payload.text
                return query
            })

            return {
                ...state,
                queries: newState
            }

        case AQ_EDIT_CELL_QUERY:
            let queries = state.queries;
            queries.find(query => query.key === action.payload.key)[action.payload.column] = action.payload.value;
            return {
                ...state,
                queries: [...queries]
            }

        default:
            return state
    }
}
