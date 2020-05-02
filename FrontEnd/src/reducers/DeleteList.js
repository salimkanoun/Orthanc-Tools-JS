import { ADD_DELETE_LIST, REMOVE_PATIENT_DELETE_LIST, REMOVE_STUDY_DELETE_LIST, DELETE_LIST } from "../actions/actions-types"

const initialState = {
    deleteList: []
}

export default function deleteListReducer (state = initialState, action ) {
    switch (action.type) {

        case ADD_DELETE_LIST:
          let deleteArray = action.payload
          //Add only id that are not already in the delete list
          let newStudies = deleteArray.filter(id =>  ! state.deleteList.includes(id) )
          let newIncresedList = [...state.deleteList, ...newStudies]
          return {
            deleteList : newIncresedList
          }

        case REMOVE_PATIENT_DELETE_LIST:
          let newSlipcedList = state.deleteList.filter(study =>{
            return study.ParentPatient === action.payload.id
          })
          return {
            deleteList: newSlipcedList
          }
        
        case REMOVE_STUDY_DELETE_LIST:
          let newFilteredList = state.deleteList.filter(study =>{
            return study.ID === action.payload.id
          })
          return {
            deleteList: newFilteredList
          }

        case DELETE_LIST:
          return {
            deleteList: []
          }

        default:
            return state
    }
  }