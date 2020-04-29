import { ADD_STUDY_DELETE_LIST, REMOVE_PATIENT_DELETE_LIST, REMOVE_STUDY_DELETE_LIST, DELETE_LIST} from './actions-types'

export function addStudyToDeleteList(deleteList){
    return {
        type: ADD_STUDY_DELETE_LIST, 
        payload: {
            ...deleteList
        }
    }
}

export function removePatientFromDeleteList(patient){
    return {
        type: REMOVE_PATIENT_DELETE_LIST, 
        payload: {...patient}
    }
}

export function removeStudyFromDeleteList(study){
    return{
        type: REMOVE_STUDY_DELETE_LIST,
        payload: {...study}
    }
}

export function deleteContent() {
    return {
        type : DELETE_LIST,
    }
}