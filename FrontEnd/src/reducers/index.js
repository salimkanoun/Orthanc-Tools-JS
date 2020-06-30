import { combineReducers } from 'redux'
import OrthancTools from './OrthancTools'
import ManualQuery from './ManualQuery'
import AutoRetrieveQueryList from './AutoRetrieveQueryList'
import AutoRetrieveResultList from './AutoRetrieveResultList'
import DeleteList from './DeleteList'
import ExportList from './ExportList'
import AnonList from './AnonList'
import OrthancContent from './OrthancContent'
import Username from './Username'

const appReducer = combineReducers({
  OrthancTools,
  ManualQuery,
  AutoRetrieveQueryList,
  AutoRetrieveResultList,
  DeleteList, 
  ExportList, 
  AnonList, 
  OrthancContent, 
  Username
})

const rootReducer = (state, action) => {
  if (action.type === 'LOG_OUT') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer