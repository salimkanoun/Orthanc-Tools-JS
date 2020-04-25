import { ANONYMIZE_CONTENT } from "../actions/actions-types"
const initialState = {
    listContent: []
}
/**
 * TODO
 * @param {*} action 
 */
export default function orthancContentReducer (state = initialState, action) {
    switch (action.type) {
        case ANONYMIZE_CONTENT:
            return
        default:
            return state
    }
  }