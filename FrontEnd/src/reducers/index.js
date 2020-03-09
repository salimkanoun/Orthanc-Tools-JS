import { combineReducers } from 'redux'
import OrthancTools from './OrthancTools'
import QueryList from './QueryList'
import ResultList from './ResultList'

export default combineReducers({
  OrthancTools,
  QueryList,
  ResultList
})
