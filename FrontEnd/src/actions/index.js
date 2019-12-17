import {SET_TAB} from "./actions-types"

export function setTab(choosenTab){
    return {
        type : SET_TAB,
        payload : choosenTab
    }
}