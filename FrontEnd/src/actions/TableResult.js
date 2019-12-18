import {RETRIEVE, REMOVE_RESULT, ADD_RESULT_TO_LIST} from './actions-types'


export function retrive(data){
    return {
        type : RETRIEVE,
        payload : data
    }

}

export function removeResult(lineNumber){
    return {
        type : REMOVE_RESULT,
        payload : lineNumber
    }
}

export function addResult(resultData){
    return {
        type : ADD_RESULT_TO_LIST,
        payload : resultData
    }
}
