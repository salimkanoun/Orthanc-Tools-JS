import { ADD_DELETE_LIST, REMOVE_PATIENT_DELETE_LIST, REMOVE_STUDY_DELETE_LIST, DELETE_LIST } from "../actions/actions-types"

const initialState = {
    deleteList: []
}

export default function orthancContentReducer (state = initialState, action ) {
    switch (action.type) {
        case ADD_DELETE_LIST:
          let newList = state.deleteList
          newList[action.payload.id] = {...action.payload}
          return {deleteList: newList} //Ne change pas la taille donc ne met pas a jour le popover 
        case REMOVE_PATIENT_DELETE_LIST:
          console.log(state.deleteList[action.payload.id])
          return {
            deleteList: state.deleteList.splice(action.payload.id, 1)
          }
        case REMOVE_STUDY_DELETE_LIST:
          newList = state.deleteList
          if (Object.keys(newList[action.payload.PatientOrthancID].studies).length === 1){ // 1 study => delete patient
            console.log(state.deleteList.splice(action.payload.id, 1))
            return {
              deleteList: state.deleteList.splice(action.payload.id, 1)
            }
          }else{
            let newStudies
            let idStudies = Object.keys(newList[action.payload.PatientOrthancID].studies)
            idStudies.forEach(id => {
              if (id !== action.payload.StudyOrthancID){
                newStudies = {...newStudies, [id]: newList[action.payload.PatientOrthancID].studies[id]}
              }                
            });
            newList[action.payload.PatientOrthancID].studies = newStudies
            console.log(newList)
            return {
              deleteList: [...newList]
            }
          }
        case DELETE_LIST:
          return //delete content of the list 
        default:
            return state
    }
    
  }