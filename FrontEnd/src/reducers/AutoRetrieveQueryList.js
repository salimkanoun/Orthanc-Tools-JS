import { AQ_ADD_QUERY_TO_LIST, AQ_REMOVE_QUERY, AQ_ADD_EMPTY_QUERY, AQ_EMPTY_QUERY, AQ_EDIT_COLUMN_QUERY } from '../actions/actions-types'

const initialState = {
  queries: []
}

export default function queryListReducer (state = initialState, action) {

  switch (action.type) {

    case AQ_ADD_QUERY_TO_LIST:
      let maxKey = Math.max.apply(Math, state.queries.map(function (query) { return query.key }))
      maxKey = Math.max(0, maxKey)
      let queriesListCopy = [...state.queries]
      queriesListCopy.push({
        key: (maxKey + 1),
        ...action.payload
      })
      return {
        ...state,
        queries : queriesListCopy
      }

    case AQ_ADD_EMPTY_QUERY:
      let maxKey2 = Math.max.apply(Math, state.queries.map(function (query) { return query.key }))
      maxKey2 = Math.max(0, maxKey2)
      let queriesCopy = [...state.queries]
      queriesCopy.push({
        key: (maxKey2 + 1),
        patientName: '',
        patientId: '',
        accessionNumber: '',
        dateFrom: '',
        dateTo: '',
        studyDescription: '',
        modalities: '',
        aet: ''

      })
      return {
        ...state,
        queries : queriesCopy
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
        query[query.key] = query.key++
        query[action.payload.columnName] = action.payload.text
        return query
      })

      return {
        ...state,
        queries: newState
      }

    default:
      return state
  }
}
