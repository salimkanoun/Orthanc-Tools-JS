import { ADD_ANON_LIST, EMPTY_ANON_LIST, REMOVE_STUDY_ANON_LIST, REMOVE_PATIENT_ANON_LIST, SAVE_NEW_VALUES, SAVE_ANON_PROFILE, AUTOFILL, ADD_ANONYMIZED_LIST, EMPTY_ANONYMIZED_LIST, REMOVE_STUDY_ANONYMIZED_LIST } from "../actions/actions-types"
const initialState = {
    anonList: [],
    anonymizedList: [],
    profile: 'Default'
}
/**
 * TODO
 * @param {*} action 
 */
export default function anonListReducer (state = initialState, action) {
    switch (action.type) {
        case ADD_ANON_LIST:
            let anonArray = action.payload
            //Add only id that are not already in the anon list
            let knownOrthancStudyID = state.anonList.map(study => study.ID)
            let newStudies = anonArray.filter(studyObject => ! knownOrthancStudyID.includes(studyObject.ID) )
            let newIncresedList = [...state.anonList, ...newStudies]
            return {
              anonList : newIncresedList, 
              profile: state.profile, 
              anonymizedList: state.anonymizedList
            }
        case ADD_ANONYMIZED_LIST:
          let anonArray1 = action.payload
          //Add only id that are not already in the anon list
          let newStudies1 = []
          anonArray1.forEach((item) => {
            let find = false
            state.anonymizedList.forEach(element => {
              if (item.ID === element.ID)
                find = true
            })
            if (!find){newStudies1.push(item)}
          })
          let newIncresedList1 = [...state.anonymizedList, ...newStudies1]
          return {
            anonymizedList : newIncresedList1, 
            profile: state.profile, 
            anonList: state.anonList
          }
        case EMPTY_ANON_LIST:
            return {
                anonList: [], 
                profile: state.profile, 
                anonymizedList: state.anonymizedList
            }
        case EMPTY_ANONYMIZED_LIST:
          return {
              anonymizedList: [],
              anonList: state.anonList, 
              profile: state.profile
        }
        case REMOVE_PATIENT_ANON_LIST:
          //Filter (remove) patient corresponding to payload ID
          let newSlipcedList = state.anonList.filter(study =>{
            return study.ParentPatient !== action.payload
          })
          return {
            anonList: newSlipcedList, 
            profile: state.profile, 
            anonymizedList: state.anonymizedList
          }
        case REMOVE_STUDY_ANON_LIST:
          //Filter study corresponding to studyID
          let newFilteredList = state.anonList.filter(study =>{
            return study.ID !== action.payload
          })
          return {
            anonList: newFilteredList, 
            profile: state.profile, 
            anonymizedList: state.anonymizedList
          }
        case REMOVE_STUDY_ANONYMIZED_LIST:
          //Filter study corresponding to studyID
          let newFilteredList1 = state.anonymizedList.filter(study =>{
            return study.ID !== action.payload
          })
          return {
            anonymizedList: newFilteredList1,
            anonList: state.anonList, 
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
            profile: state.profile, 
            anonymizedList: state.anonymizedList
          }
        case SAVE_ANON_PROFILE:
          return {
            anonList: state.anonList,
            profile: action.payload, 
            anonymizedList: state.anonymizedList
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
            profile: state.profile, 
            anonymizedList: state.anonymizedList
          }
        default:
            return state
    }
  }