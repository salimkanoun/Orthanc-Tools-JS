import { ADD_DELETE_LIST, REMOVE_PATIENT_DELETE_LIST, REMOVE_STUDY_DELETE_LIST, DELETE_LIST } from "../actions/actions-types"

const initialState = {
    deleteList: []
}

export default function deleteListReducer (state = initialState, action ) {
    switch (action.type) {
        case ADD_DELETE_LIST:
          let newList = [...state.deleteList]
          newList[action.payload.id] = {...action.payload}
          console.log(newList) //La liste ne garde pas les ancien élément
          //Il y a qu'un seul patient dedans à chaque fois. 
          //ça fonctionne quand je le transforme en object {} mais ça me génére des erreurs plus loin par que j'applique des méthodes spécifique aux array
          return {deleteList: newList} 
        case REMOVE_PATIENT_DELETE_LIST:
          console.log(state.deleteList[action.payload.id])
          return {
            deleteList: state.deleteList.splice(action.payload.id, 1) //fonctionne 
          }
        case REMOVE_STUDY_DELETE_LIST:
          if (Object.keys(state.deleteList[action.payload.PatientOrthancID].studies).length === 1){ // 1 study => delete patient
            console.log(state.deleteList.splice(action.payload.id, 1))
            return {
              deleteList: state.deleteList.splice(action.payload.id, 1) //Fonctionne 
            }
          }else{
            let newStudies = {}
            let idStudies = Object.keys(state.deleteList[action.payload.PatientOrthancID].studies)
            idStudies.forEach(id => {
              if (id !== action.payload.StudyOrthancID){
                newStudies = {...newStudies, [id]: state.deleteList[action.payload.PatientOrthancID].studies[id]}
              }                
            });
            console.log(state.deleteList)
            let newList = [...state.deleteList] //renvoie du vide donc une erreur est générée à la ligne suivante quand je veux lui lire un propriété 
            newList[action.payload.PatientOrthancID].studies = newStudies
            return {
              deleteList: newList
            }
          }
        case DELETE_LIST:
          return //delete content of the list 
        default:
            return state
    }
  }