import {ADD_AET, SET_FORM_DATA, ADD_MODALITIES} from '../actions/actions-types'

const initialState={
    aets : [],
    modalities : []
}

export default function formInputReducer(state=initialState, action){
    switch(action.type){
        case ADD_AET :
            return{
                ...state,
                aets: action.payload
            }
        case SET_FORM_DATA :
            return{ ...state,
                [action.payload.name] : action.payload.value
            }
        case ADD_MODALITIES : 
            let modalities = action.payload.map(a => a.value);
            return { ...state,
                modalities : modalities
            }
        default :
            return state
    }


}