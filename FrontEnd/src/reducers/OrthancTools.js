import { LOAD_AETS, LOG_IN } from '../actions/actions-types'

const initialState = {
  OrthancAets: [],
  roles: {},
  username: null
}

export default function orthancToolsReducer(state = initialState, action) {
  switch (action.type) {

    case LOAD_AETS:
      return {
        ...state,
        OrthancAets: action.payload
      }

    case LOG_IN:
      return {
        ...state,
        username: action.payload.username,
        roles: {...action.payload}
      }

    default:
      return state
  }
}
