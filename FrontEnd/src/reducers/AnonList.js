import { ANONYMIZE_CONTENT, ADD_ANON_LIST, EMPTY_ANON_LIST, REMOVE_STUDY_ANON_LIST, REMOVE_PATIENT_ANON_LIST } from "../actions/actions-types"
const initialState = {
    anonList: []
}
/**
 * TODO
 * @param {*} action 
 */
export default function orthancContentReducer (state = initialState, action) {
    switch (action.type) {
        case ANONYMIZE_CONTENT:
            return
        case ADD_ANON_LIST:
            let anonArray = action.payload
            //Add only id that are not already in the anon list
            let newStudies = anonArray.filter(id =>  ! state.anonList.includes(id) )
            let newIncresedList = [...state.anonList, ...newStudies]
            return {
              anonList : newIncresedList
            }
        case EMPTY_ANON_LIST:
            return {
                anonList: []
            }
        case REMOVE_PATIENT_ANON_LIST:
          //Filter (remove) patient corresponding to payload ID
          let newSlipcedList = state.anonList.filter(study =>{
            return study.ParentPatient !== action.payload
          })
          return {
            anonList: newSlipcedList
          }
        case REMOVE_STUDY_ANON_LIST:
            //Filter study corresponding to studyID
            let newFilteredList = state.anonList.filter(study =>{
              return study.ID !== action.payload
            })
            return {
              anonList: newFilteredList
            }
        default:
            return state
    }
  }