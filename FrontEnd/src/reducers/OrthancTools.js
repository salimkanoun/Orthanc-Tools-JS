import { LOAD_AETS, LOG_IN } from '../actions/actions-types'

const initialState = {
  token : null,
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
        ...action.payload.backendData,
        token : action.payload.token,
        
      }

    default:
      return state
  }
}
