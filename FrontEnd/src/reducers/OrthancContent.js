import {ADD_ORTHANC_CONTENT, REMOVE_ORTHANC_CONTENT } from "../actions/actions-types"

const initialState = {
    orthancContent: []
}

export default function deleteListReducer (state = initialState, action ) {
    switch (action.type) {
        case ADD_ORTHANC_CONTENT:
            return {orthancContent: action.payload }
        case REMOVE_ORTHANC_CONTENT:
            let newSlipcedList = state.orthancContent.filter(study =>{
                return study.ID !== action.payload
              })
              return {
                orthancContent: newSlipcedList
              }
        default:
            return state
    }
}