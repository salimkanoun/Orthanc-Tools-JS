import { ADD_STUDY_DELETE_LIST, REMOVE_PATIENT_DELETE_LIST, REMOVE_STUDY_DELETE_LIST, EMPTY_DELETE_LIST } from "../actions/actions-types"

const initialState = {
    deleteList: []
}

export default function deleteListReducer (state = initialState, action ) {
    switch (action.type) {

        case ADD_STUDY_DELETE_LIST:
          let deleteArray = action.payload
          //Add only id that are not already in the delete list
          let knownOrthancStudyID = state.deleteList.map(study => study.ID)
          let newStudies = deleteArray.filter(studyObject => !knownOrthancStudyID.includes(studyObject.ID) )
          let newIncresedList = [...state.deleteList, ...newStudies]
          return {
            deleteList : newIncresedList
          }

        case REMOVE_PATIENT_DELETE_LIST:
          //Filter (remove) patient corresponding to payload ID
          let newSlipcedList = state.deleteList.filter(study =>{
            return study.ParentPatient !== action.payload
          })
          return {
            deleteList: newSlipcedList
          }
        
        case REMOVE_STUDY_DELETE_LIST:
          //Filter study corresponding to studyID
          let newFilteredList = state.deleteList.filter(study =>{
            return study.ID !== action.payload
          })
          return {
            deleteList: newFilteredList
          }

        case EMPTY_DELETE_LIST:
          return {
            deleteList: []
          }

        default:
            return state
    }
  }