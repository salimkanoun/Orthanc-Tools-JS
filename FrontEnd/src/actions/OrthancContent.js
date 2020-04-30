import { ADD_ORTHANC_CONTENT} from './actions-types'

export function addOrthancContent(content){
    return {
        type: ADD_ORTHANC_CONTENT, 
        payload: {
            ...content
        }
    }
}