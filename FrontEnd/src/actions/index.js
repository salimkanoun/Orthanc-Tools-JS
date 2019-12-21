import {ADD_AET, SET_TAB} from "./actions-types"

export function setTab(choosenTab){
    return {
        type : SET_TAB,
        payload : choosenTab
    }
}

export function setAets(aet){
    return {
        type : ADD_AET,
        payload : aet
    }

}