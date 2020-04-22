import { DELETE_CONTENT, ADD_CONTENT, REMOVE_CONTENT /*, EXPORT_CONTENT, ANONYMIZE_CONTENT */ } from './actions-types'


export function deleteContent() {
    return {
        type : DELETE_CONTENT,
    }
}

export function addContent(content){
    return {
        type: ADD_CONTENT, 
        payload: {
            level: content.level, 
            id: content.id
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



/*

export function exportContent(){
    return {
        type : EXPORT_CONTENT
    }
}

export function anonymizeContent(){
    return [
        type : ANONYMIZE_CONTENT
    ]
}

*/