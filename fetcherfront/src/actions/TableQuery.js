import {REMOVE_QUERY} from './actions-types'


export function removeQuery(id){
    return {
        type : REMOVE_QUERY,
        payload : id
    }

}
