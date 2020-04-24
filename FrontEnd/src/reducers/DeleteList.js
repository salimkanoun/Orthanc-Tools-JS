import { DELETE_CONTENT } from "../actions/actions-types"

const initialState = {
    listContent: []
}

export default function orthancContentReducer (state = initialState, action ) {
    switch (action.type) {
        case DELETE_CONTENT:
          return //delete content of the list 
        default:
            return state
    }
  }