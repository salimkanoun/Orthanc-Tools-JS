import {REMOVE_QUERY} from './actions-types'


export function removeQuery(lineNumber){
    return {
        type : REMOVE_QUERY,
        payload : lineNumber
    }

}
