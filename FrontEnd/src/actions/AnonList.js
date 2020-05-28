import {  ADD_ANON_LIST, EMPTY_ANON_LIST, REMOVE_PATIENT_ANON_LIST, REMOVE_STUDY_ANON_LIST, SAVE_NEW_VALUES, SAVE_ANON_PROFILE, AUTOFILL, ADD_ANONYMIZED_LIST, EMPTY_ANONYMIZED_LIST, REMOVE_STUDY_ANONYMIZED_LIST } from './actions-types'

export function addStudiesToAnonList(studiesArray){
    return {
        type: ADD_ANON_LIST, 
        payload: studiesArray
    }
}

export function addToAnonymizedList(anonList){
    return {
        type: ADD_ANONYMIZED_LIST, 
        payload: anonList
    }
}

export function emptyAnonymizeList(){
    return {
        type: EMPTY_ANON_LIST
    }
}

export function emptyAnonymizedList(){
    return {
        type: EMPTY_ANONYMIZED_LIST
    }
}

export function removePatientFromAnonList(patientOrthancID){
    return {
        type: REMOVE_PATIENT_ANON_LIST, 
        payload: patientOrthancID
    }
}

export function removeStudyFromAnonList(studyOrhancID){
    return {
        type: REMOVE_STUDY_ANON_LIST, 
        payload: studyOrhancID
    }
}

export function removeStudyFromAnonymizedList(studyOrhancID){
    return {
        type: REMOVE_STUDY_ANONYMIZED_LIST, 
        payload: studyOrhancID
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