import { combineReducers } from 'redux'
import OrthancTools from './OrthancTools'
import Query from './Query'
import QueryList from './QueryList'
import ResultList from './ResultList'

export default combineReducers({
  OrthancTools,
  Query,
  QueryList,
  ResultList
})
