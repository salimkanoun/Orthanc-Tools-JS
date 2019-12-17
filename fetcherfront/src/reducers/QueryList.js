import {ADD_QUERY_TO_LIST, REMOVE_QUERY} from '../actions/actions-types'

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
        case REMOVE_QUERY : 
            let removedLines = action.payload;
            removedLines.sort(function(a, b){return b-a});
            removedLines.forEach(element => {
                state.queries.splice(element, 1)
            });
            return state
        default :
            return state
    }


}

