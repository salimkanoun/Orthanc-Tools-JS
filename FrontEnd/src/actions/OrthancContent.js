import { ADD_ORTHANC_CONTENT, REMOVE_ORTHANC_CONTENT_PATIENT, REMOVE_ORTHANC_CONTENT_STUDY} from './actions-types'

export function addOrthancContent(orthanctudyArray){
    return {
        type: ADD_ORTHANC_CONTENT, 
        payload: orthanctudyArray
    }
}

export function removeOrthancContentStudy(orthancStudyID){
    return {
        type: REMOVE_ORTHANC_CONTENT_STUDY, 
        payload: orthancStudyID
    }
}

export function removeOrthancContentPatient(OrthancPatientID){
    return {
        type: REMOVE_ORTHANC_CONTENT_PATIENT, 
        payload: OrthancPatientID
    }
}