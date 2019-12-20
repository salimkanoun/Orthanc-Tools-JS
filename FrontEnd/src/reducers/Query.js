import { SET_TAB } from '../actions/actions-types'

const initialState={
    currentMainTab : 'Query'
}

export default function tabReducer(state = initialState, action){
    switch(action.type){
        case SET_TAB : 
            return {
                currentMainTab : action.payload
            };
        default:
            return state;

    }
}