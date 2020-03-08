import { LOAD_AETS } from '../actions/actions-types'

const initialState = {
  OrthancAets: []
}

export default function aetsReducer (state = initialState, action) {
  switch (action.type) {
    case LOAD_AETS :
      return {
        OrthancAet: action.payload
      }
    default:
      return state
  }
}