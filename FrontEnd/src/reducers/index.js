import { combineReducers } from 'redux'
import OrthancTools from './OrthancTools'
import ManualQuery from './ManualQuery'
import AutoRetrieveQueryList from './AutoRetrieveQueryList'
import AutoRetrieveResultList from './AutoRetrieveResultList'
import DeleteList from './DeleteList'
import ExportList from './ExportList'
import AnonList from './AnonList'
import OrthancContent from './OrthancContent'

export default combineReducers({
  OrthancTools,
  ManualQuery,
  AutoRetrieveQueryList,
  AutoRetrieveResultList,
  DeleteList, 
  ExportList, 
  AnonList, 
  OrthancContent
})
