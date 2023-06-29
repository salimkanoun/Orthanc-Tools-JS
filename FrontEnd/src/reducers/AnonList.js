import {
  ADD_ANON_LIST,
  EMPTY_ANON_LIST,
  REMOVE_STUDY_ANON_LIST,
  REMOVE_PATIENT_ANON_LIST,
  SAVE_NEW_VALUES,
  SAVE_ANON_PROFILE,
  AUTOFILL
} from "../actions/actions-types"

const initialState = {
  anonList: [],
  profile: 'Default'
}
/**
 * TODO
 * @param {*} action 
 */
export default function anonListReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ANON_LIST:
      let anonArray = action.payload
      //Add only id that are not already in the anon list
      let knownOrthancStudyID = state.anonList.map(study => study.StudyOrthancID)
      let newStudies = anonArray.filter(studyObject => !knownOrthancStudyID.includes(studyObject.StudyOrthancID)).map(study => ({
        ...study,
        ParentPatient: {
          ...study.ParentPatient,
          newPatientName: '',
          newPatientID: ''
        }
      }))
      let newIncresedList = [...state.anonList, ...newStudies]
      return {
        anonList: newIncresedList,
        profile: state.profile
      }
    case EMPTY_ANON_LIST:
      return {
        anonList: [],
        profile: state.profile
      }
    case REMOVE_PATIENT_ANON_LIST:
      //Filter (remove) patient corresponding to payload ID
      let newSlipcedList = state.anonList.filter(study => {
        return study.PatientOrthancID !== action.payload
      })
      return {
        anonList: newSlipcedList,
        profile: state.profile
      }
    case REMOVE_STUDY_ANON_LIST:
      //Filter study corresponding to studyID
      let newFilteredList = state.anonList.filter(study => {
        return study.StudyOrthancID !== action.payload
      })
      return {
        anonList: newFilteredList,
        profile: state.profile
      }
    case SAVE_NEW_VALUES:
      let { id, column, newValue } = action.payload
      let newList = [...state.anonList]
      if (column === 'newStudyDescription' || column === 'newAccessionNumber') {
        newList.forEach(element => {
          if (element.StudyOrthancID === id) {
            element[column] = newValue
          }
        })
      } else {
        newList.forEach(element => {
          if (element.PatientOrthancID === id) {
            element.ParentPatient = {
              ...element.ParentPatient,
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
      let tab = {}
      let copyList = [...state.anonList]

      copyList.forEach(study => {
        let PatientOrthancID = study.PatientOrthancID
        if (!Object.keys(tab).includes(PatientOrthancID)) {
          tab[PatientOrthancID] = prefix + number
          ++number
        }
      })

      copyList.forEach((study) => {
        study.ParentPatient = {
          ...study.ParentPatient,
          newPatientName: study.ParentPatient.newPatientName !== '' ? study.ParentPatient.newPatientName : tab[study.PatientOrthancID],
          newPatientID: study.ParentPatient.newPatientID !== '' ? study.ParentPatient.newPatientID : tab[study.PatientOrthancID]
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