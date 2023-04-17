import { ADD_STUDY_DELETE_LIST, REMOVE_PATIENT_DELETE_LIST, REMOVE_STUDY_DELETE_LIST, EMPTY_DELETE_LIST} from './actions-types'

export function addStudiesToDeleteList(studiesArray){
    return {
        type: ADD_STUDY_DELETE_LIST, 
        payload: studiesArray
    }
}

export function removePatientFromDeleteList(PatientID){
    return {
        type: REMOVE_PATIENT_DELETE_LIST, 
        payload: PatientID
    }
}

export function removeStudyFromDeleteList(StudyID){
    return{
        type: REMOVE_STUDY_DELETE_LIST,
        payload: StudyID
    }
}

export function emptyDeleteList() {
    return {
        type : EMPTY_DELETE_LIST,
    }
}