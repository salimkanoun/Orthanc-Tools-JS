import { ADD_ORTHANC_CONTENT, REMOVE_ORTHANC_CONTENT} from './actions-types'

export function addOrthancContent(orthanctudyArray){
    return {
        type: ADD_ORTHANC_CONTENT, 
        payload: orthanctudyArray
    }
}

export function removeOrthancContent(orthancStudyID){
    return {
        type: REMOVE_ORTHANC_CONTENT, 
        payload: orthancStudyID
    }
}