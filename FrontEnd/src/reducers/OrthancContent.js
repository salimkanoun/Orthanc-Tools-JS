import {ADD_ORTHANC_CONTENT } from "../actions/actions-types"

const initialState = {
    orthancContent: []
}

export default function deleteListReducer (state = initialState, action ) {
    switch (action.type) {
        case ADD_ORTHANC_CONTENT:
            return {orthancContent: action.payload}
        default:
            return state
    }
}