import { ADD_DELETE_LIST, REMOVE_PATIENT_DELETE_LIST, REMOVE_STUDY_DELETE_LIST, DELETE_LIST } from "../actions/actions-types"

const initialState = {
    deleteList: []
}

export default function orthancContentReducer (state = initialState, action ) {
  
    switch (action.type) {
        case ADD_DELETE_LIST:
          return {
            deleteList: [
              ...state.deleteList.filter(content => content.id !== action.payload.id),
              {...action.payload}]
          }
        case REMOVE_PATIENT_DELETE_LIST:
          return {
            deleteList: state.deleteList.filter(content => content.id !== action.payload.id)
          }
        case REMOVE_STUDY_DELETE_LIST:
          let newList = state.deleteList
          let newPatient = undefined
          state.deleteList.forEach(element => {
            if (element.id === action.payload.PatientOrthancID){
              if (Object.keys(element.studies).length > 1 ){ //Si c'est le seul study, le patient sera supprimé
                //il faut enlever le study à la list des study du patient
                let newStudies
                let idStudies = Object.keys(element.studies)
                idStudies.forEach(id => {
                  if (id !== action.payload.StudyOrthancID){
                    newStudies = {...newStudies, [id]: element.studies[id]}
                  }                
                });
                newPatient = newList[newList.indexOf(element)]
                newPatient.studies = newStudies
                
              }
          }
          
          });
          if (newPatient !== undefined){
            return {
                    deleteList: [
                      ...state.deleteList.filter(content => content.id !== action.payload.PatientOrthancID),
                      {...newPatient}]
                  }
          }else{
            return {
              deleteList: [...state.deleteList.filter(content => content.id !== action.payload.PatientOrthancID)]
            }
          }
          
        case DELETE_LIST:
          return //delete content of the list 
        default:
            return state
    }
  }