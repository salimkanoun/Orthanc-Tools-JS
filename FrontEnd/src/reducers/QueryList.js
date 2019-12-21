import {ADD_QUERY_TO_LIST, REMOVE_QUERY, ADD_EMPTY_QUERY} from '../actions/actions-types'

const initialState={
    queries: []
}

export default function queryListReducer(state=initialState, action){
    switch(action.type){
        case ADD_QUERY_TO_LIST :
            let maxKey=Math.max.apply(Math, state.queries.map(function(query) { return query.key; }))
            maxKey=Math.max(0,maxKey)
            state.queries.push({
                key : (maxKey+1),
                ...action.payload
            })
            return {
                ...state
            }
        case ADD_EMPTY_QUERY:
            let maxKey2=Math.max.apply(Math, state.queries.map(function(query) { return query.key; }))
            maxKey2=Math.max(0,maxKey2)
            state.queries.push({
                key : (maxKey2+1),
                patientName : '',
                patientId : '',
                accessionNumber : '',
                dateFrom : '',
                dateTo: '',
                studyDescription: '',
                modalities : '',
                aet : ''

            })
            return {
                ...state
            }
        case REMOVE_QUERY : 
            let removedLines = action.payload;
            let newQueries = state.queries.filter(function( query ) {
                return ! removedLines.includes(query.key);
            });
            return { ...state,
                    queries : newQueries,
                   }
        default :
            return state
    }


}

