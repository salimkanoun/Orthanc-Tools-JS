import { ADD_DELETE_LIST, REMOVE_PATIENT_DELETE_LIST, REMOVE_STUDY_DELETE_LIST, DELETE_LIST } from "../actions/actions-types"

const initialState = {
    deleteList: []
}

export default function orthancContentReducer (state = initialState, action ) {
  
  console.log(action.payload)
  console.log(state.deleteList)
    switch (action.type) {
        case ADD_DELETE_LIST:
          return {
            deleteList: [
              ...state.deleteList.filter(content => content.id !== action.payload.id),
              {...action.payload}]
          }
        case REMOVE_PATIENT_DELETE_LIST:
          return {
            deleteList: state.deleteList.filter(content => content.id !== action.payload.PatientOrthancID)
          }
        case REMOVE_STUDY_DELETE_LIST:
          let newList = state.deleteList
          state.deleteList.forEach(element => {
            if (element.id === action.payload.PatientOrthancID){
              //Patient auquel appartient le study 
              //si qu'un study et que c'est le même id => supprime le patient directement
              
              if (Object.keys(element.studies).length === 1 ){
                if (element.studies[action.payload.StudyOrthancID] !== undefined){
                  newList = state.deleteList.filter(content => content.id !== action.payload.PatientOrthancID)
                }
              }
              else {     
                //il faut enlever le study à la list des study du patient
                let newStudies
                let idStudies = Object.keys(element.studies)
                idStudies.forEach(id => {
                  if (id !== action.payload.StudyOrthancID){
                    newStudies = {...newStudies, [id]: element.studies[id]}
                  }                
                });
                newList[newList.indexOf(element)].studies = newStudies
                newList[newList.indexOf(element)].row.studies = newStudies
              }
          }
          });
        
          console.log(newList)
          return {deleteList: newList}
        
        case DELETE_LIST:
          return //delete content of the list 
        default:
            return state
    }
  }