import { LOG_IN, LOG_OUT } from './actions-types'


export function login(token, backendData){
    return {
        type: LOG_IN, 
        payload: {
            token : token,
            backendData : backendData
        }
    }

}

export function logout(){
    return {
        type: LOG_OUT
    }
}