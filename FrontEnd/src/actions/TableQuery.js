import {REMOVE_QUERY, ADD_EMPTY_QUERY} from './actions-types'


export function removeQuery(lineNumber){
    return {
        type : REMOVE_QUERY,
        payload : lineNumber
    }

}

export function addRow(){
    return{
        type : ADD_EMPTY_QUERY
    }
}
