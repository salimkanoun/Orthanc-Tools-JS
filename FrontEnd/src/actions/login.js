import { LOG_IN, LOG_OUT } from './actions-types'


export function login(backendData){
    return {
        type: LOG_IN, 
        payload: backendData
    }

}

export function logout(){
    return {
        type: LOG_OUT
    }
}