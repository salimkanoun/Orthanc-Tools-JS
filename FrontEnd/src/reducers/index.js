import { combineReducers } from 'redux'
import Query from './Query'
import FormInput from './FormInput'
import QueryList from './QueryList'
import ResultList from './ResultList'

export default combineReducers({
  Query,
  FormInput,
  QueryList,
  ResultList
})
