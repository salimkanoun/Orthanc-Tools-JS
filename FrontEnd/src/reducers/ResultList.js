import {RETRIEVE, REMOVE_RESULT, ADD_RESULT_TO_LIST} from '../actions/actions-types'

const initialState={
    results: []
}

export default function retrieveListReducer(state=initialState, action){
    switch(action.type){
        case RETRIEVE :
            return {
                ...state
        }
        case REMOVE_RESULT : 
            let removedLines = action.payload;
            let newResults = state.results.filter(function( results ) {
                return ! removedLines.includes(results.key);
            });
            return { ...state,
                    queries : newResults,
                }
        case ADD_RESULT_TO_LIST:
            let maxKey=Math.max.apply(Math, state.queries.map(function(query) { return query.key; }))
            maxKey=Math.max(0,maxKey)
            state.results.push({
                key : (maxKey+1),
                ...action.payload
            })
            return {
                ...state
            }
        default :
            return state
    }


}

