import { combineReducers } from 'redux'
import OrthancTools from './OrthancTools'
import ManualQuery from './ManualQuery'
import QueryList from './QueryList'
import ResultList from './ResultList'
import DeleteList from './DeleteList'
import Exportlist from './ExportList'
import AnonList from './AnonList'

export default combineReducers({
  OrthancTools,
  ManualQuery,
  QueryList,
  ResultList,
  DeleteList, 
  Exportlist, 
  AnonList
})
