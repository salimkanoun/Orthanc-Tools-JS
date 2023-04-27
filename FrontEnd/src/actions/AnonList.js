import {  ADD_ANON_LIST, EMPTY_ANON_LIST, REMOVE_PATIENT_ANON_LIST, REMOVE_STUDY_ANON_LIST, SAVE_NEW_VALUES, SAVE_ANON_PROFILE, AUTOFILL } from './actions-types'

export function addStudiesToAnonList(studiesArray){
    return {
        type: ADD_ANON_LIST, 
        payload: studiesArray
    }
}

export function emptyAnonymizeList(){
    return {
        type: EMPTY_ANON_LIST
    }
}

export function removePatientFromAnonList(patientOrthancID){
    return {
        type: REMOVE_PATIENT_ANON_LIST, 
        payload: patientOrthancID
    }
}

export function removeStudyFromAnonList(studyOrthancID){
    return {
        type: REMOVE_STUDY_ANON_LIST, 
        payload: studyOrthancID
    }
}

export function saveNewValues(ID, column, newValue){
    return {
        type: SAVE_NEW_VALUES, 
        payload: {
            id : ID, 
            column: column, 
            newValue: newValue
        }
    }
}

export function saveProfile(profile){
    return {
        type: SAVE_ANON_PROFILE, 
        payload: profile
    }
}

export function autoFill(prefix){
    return {
        type: AUTOFILL, 
        payload: prefix
    }
}