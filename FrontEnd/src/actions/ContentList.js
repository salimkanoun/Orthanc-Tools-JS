import { ADD_CONTENT, REMOVE_CONTENT } from './actions-types'


export function addContent(content){
    return {
        type: ADD_CONTENT, 
        payload: {
            level: content.level, 
            id: content.id, 
            studies: content.studies, 
            parentID: content.parentID
        }
    }
}

export function removeContent(content){
    return {
        type: REMOVE_CONTENT, 
        payload: {
            level: content.level, 
            id: content.id 
        }
    }
}
