import { SAVE_USERNAME } from '../actions/actions-types'

const initialState = {
    username: ''
}

export default function orthancUsername (state = initialState, action) {
    switch (action.type) {
        case SAVE_USERNAME :
            return {
                username: action.payload
            }
        default:
            return state
    }
  }