import { LOAD_AETS } from '../actions/actions-types'

const initialState = {
  OrthancAets: []
}

export default function orthancToolsReducer (state = initialState, action) {
  switch (action.type) {
    case LOAD_AETS :
      let aetArray = Object.keys(action.payload)
      return {
        OrthancAets: aetArray
      }
    default:
      return state
  }
}
