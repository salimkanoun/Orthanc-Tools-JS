import {ADD_QUERY_TO_LIST} from '../actions/actions-types'

const initialState={
    queries: []
}

export default function queryListReducer(state=initialState, action){
    switch(action.type){
        case ADD_QUERY_TO_LIST :
            state.queries.push({
                key : state.queries.length,
                ...action.payload
            })
            return {
                ...state
        }
        default :
            return state
    }


}

