import { SAVE_USERNAME } from './actions-types'

export function saveUsername(username){
    return {
        type: SAVE_USERNAME, 
        payload: username
    }
}