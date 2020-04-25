import { EXPORT_CONTENT } from "../actions/actions-types"
const initialState = {
    listContent: []
}
/**
 * TODO
 * @param {*} action 
 */
export default function orthancContentReducer (state = initialState, action) {
    switch (action.type) {
        case EXPORT_CONTENT:
            return
        default:
            return state
    }
  }