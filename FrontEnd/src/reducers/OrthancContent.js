import {ADD_ORTHANC_CONTENT, REMOVE_ORTHANC_CONTENT_STUDY, REMOVE_ORTHANC_CONTENT_PATIENT } from "../actions/actions-types"

const initialState = {
    orthancContent: []
}

export default function contentListReducer (state = initialState, action ) {
    switch (action.type) {
        case ADD_ORTHANC_CONTENT:
            return {orthancContent: action.payload }
        case REMOVE_ORTHANC_CONTENT_STUDY:
            let newSlipcedList = state.orthancContent.filter(study =>{
                return study.ID !== action.payload
              })
              return {
                orthancContent: newSlipcedList
              }
        case REMOVE_ORTHANC_CONTENT_PATIENT:
            let newList = state.orthancContent.filter(study => {
                return study.ParentPatient !== action.payload
            } )
            console.log(newList)
            return {
                orthancContent: newList
            }
        default:
            return state
    }
}