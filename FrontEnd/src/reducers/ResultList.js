import {RETRIEVE} from '../actions/actions-types'

const initialState={
    results: []
}

export default function retrieveListReducer(state=initialState, action){
    switch(action.type){
        case RETRIEVE :
            return {
                ...state
        }
        default :
            return state
    }


}

