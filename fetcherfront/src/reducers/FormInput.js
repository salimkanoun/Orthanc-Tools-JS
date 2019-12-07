import {ADD_AET, SET_FORM_DATA} from '../actions/actions-types'

const initialState={
    aets : []
}

export default function formInputReducer(state=initialState, action){
    switch(action.type){
        case ADD_AET : 
            return{
                aets: action.payload
            }
        case SET_FORM_DATA : 
            return{
                [action.payload.name] : action.payload.data
            }
        
        default :
            return state
    }


}