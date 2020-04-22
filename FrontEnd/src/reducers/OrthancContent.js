import { DELETE_CONTENT, ADD_CONTENT, REMOVE_CONTENT /*, ANONYMIZE_CONTENT, EXPORT_CONTENT*/ } from "../actions/actions-types"
const initialState = {
    listContent: []
}

export default function orthancContentReducer (state = initialState, action) {
    switch (action.type) {
        case ADD_CONTENT:
            return {
                listContent: [...state.listContent, {'level': action.payload.level, 'id': action.payload.id}]
            } 
        case REMOVE_CONTENT:
            return {
                listContent: state.listContent.filter(content => content !== {level: action.payload.level, id: action.payload.id})
            } 
        case DELETE_CONTENT:
          return //delete content of the list 
        /*
        case EXPORT_CONTENT:
            return
        case ANONYMIZE_CONTENT:
            return
        */
        default:
            return state
    }
  }