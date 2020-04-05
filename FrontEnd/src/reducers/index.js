import { combineReducers } from 'redux'
import OrthancTools from './OrthancTools'
import ManualQuery from './ManualQuery'
import QueryList from './QueryList'
import ResultList from './ResultList'

export default combineReducers({
  OrthancTools,
  ManualQuery,
  QueryList,
  ResultList
})
