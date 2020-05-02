import { ADD_ORTHANC_CONTENT} from './actions-types'

export function addOrthancContent(orthanctudyArray){
    return {
        type: ADD_ORTHANC_CONTENT, 
        payload: orthanctudyArray
    }
}