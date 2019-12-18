import {RETRIEVE} from './actions-types'


export function retrive(data){
    return {
        type : RETRIEVE,
        payload : data
    }

}
