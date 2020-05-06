import { combineReducers } from 'redux'
import OrthancTools from './OrthancTools'
import ManualQuery from './ManualQuery'
import QueryList from './QueryList'
import ResultList from './ResultList'
import DeleteList from './DeleteList'
import ExportList from './ExportList'
import AnonList from './AnonList'
import OrthancContent from './OrthancContent'

export default combineReducers({
  OrthancTools,
  ManualQuery,
  QueryList,
  ResultList,
  DeleteList, 
  ExportList, 
  AnonList, 
  OrthancContent
})
