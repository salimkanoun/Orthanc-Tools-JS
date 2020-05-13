import { ANONYMIZE_CONTENT, ADD_ANON_LIST, EMPTY_ANON_LIST, REMOVE_STUDY_ANON_LIST, REMOVE_PATIENT_ANON_LIST, SAVE_NEW_VALUES, SAVE_ANON_PROFILE, AUTOFILL } from "../actions/actions-types"
const initialState = {
    anonList: [], 
    profile: 'default'
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
              anonList : newIncresedList, 
              profile: state.profile
            }
        case EMPTY_ANON_LIST:
            return {
                anonList: [], 
                profile: state.profile
            }
        case REMOVE_PATIENT_ANON_LIST:
          //Filter (remove) patient corresponding to payload ID
          let newSlipcedList = state.anonList.filter(study =>{
            return study.ParentPatient !== action.payload
          })
          return {
            anonList: newSlipcedList, 
            profile: state.profile
          }
        case REMOVE_STUDY_ANON_LIST:
          //Filter study corresponding to studyID
          let newFilteredList = state.anonList.filter(study =>{
            return study.ID !== action.payload
          })
          return {
            anonList: newFilteredList, 
            profile: state.profile
          }
        case SAVE_NEW_VALUES:
          let { id, column, newValue } = action.payload
          let newList = [...state.anonList]
          if (column !== 'newStudyDescription' && column !== 'newAccessionNumber'){
            newList.forEach(element => {
              if (element.ParentPatient === id){
                element.PatientMainDicomTags = {
                  ...element.PatientMainDicomTags, 
                  [column]: newValue
                }
              }
            })
          } else {
            newList.forEach(element => {
              
              if (element.ID === id ){
                element.MainDicomTags = {
                  ...element.MainDicomTags, 
                  [column]: newValue
                }
              }
            })
          }
          return {
            anonList: newList, 
            profile: state.profile
          }
        case SAVE_ANON_PROFILE:
          return {
            anonList: state.anonList,
            profile: action.payload
          }
        case AUTOFILL:
          let prefix = action.payload
          let number = 0
          let tab = []
          let copyList = [...state.anonList]
          copyList.forEach(study => {
            if (tab[study.ParentPatient] === undefined){
              tab[study.ParentPatient] = prefix + number
              number ++
            }
          })
          copyList.forEach(study => {
            study.PatientMainDicomTags = {
              ...study.PatientMainDicomTags, 
              newPatientName: study.PatientMainDicomTags.newPatientName && study.PatientMainDicomTags.newPatientName !== '' ? study.PatientMainDicomTags.newPatientName : tab[study.ParentPatient],
              newPatientID: study.PatientMainDicomTags.newPatientID && study.PatientMainDicomTags.newPatientID !== '' ? study.PatientMainDicomTags.newPatientID : tab[study.ParentPatient]
            }
          })
          return {
            anonList: copyList, 
            profile: state.profile
          }
        default:
            return state
    }
  }