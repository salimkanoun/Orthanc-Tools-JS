import {  ANONYMIZE_CONTENT, ADD_ANON_LIST, EMPTY_ANON_LIST, REMOVE_PATIENT_ANON_LIST, REMOVE_STUDY_ANON_LIST, SAVE_NEW_VALUES } from './actions-types'


export function anonymizeContent(){
    return {
        type : ANONYMIZE_CONTENT
    }
}

export function addToAnonList(anonList){
    return {
        type: ADD_ANON_LIST, 
        payload: anonList
    }
}

export function emptyAnonList(){
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

export function removeStudyFromAnonList(studyOrhancID){
    return {
        type: REMOVE_STUDY_ANON_LIST, 
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