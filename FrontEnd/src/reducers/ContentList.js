import { ADD_CONTENT, REMOVE_CONTENT } from "../actions/actions-types"

const initialState = {
    listContent: []
}

export default function orthancContentReducer (state = initialState, action) {
    console.log(action);
    
    switch (action.type) {
        case ADD_CONTENT:
            return {
                listContent: [...state.listContent.filter(content => content.id !== action.payload.id), {'level': action.payload.level, 'id': action.payload.id, 'studies': action.payload.studies, 'parentID': action.payload.parentID, 'row': action.payload.row}]
            } 
        case REMOVE_CONTENT:
            return {
                listContent: state.listContent.filter(content => content.id !== action.payload.id)
            }
        default:
            return state
    }
  }