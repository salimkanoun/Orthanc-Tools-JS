import { LOAD_AETS, SAVE_USERNAME } from '../actions/actions-types'

const initialState = {
  OrthancAets: [], 
  username: ''
}

export default function orthancToolsReducer (state = initialState, action) {
  switch (action.type) {
    case LOAD_AETS :
      return {
        ...state, 
        OrthancAets: action.payload
      }
    case SAVE_USERNAME :
          return {
            ...state, 
            username: action.payload
          }
    default:
      return state
  }
}
