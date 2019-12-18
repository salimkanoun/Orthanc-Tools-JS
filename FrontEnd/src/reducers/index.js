import { combineReducers } from 'redux'
import NavBar from './NavBar'
import FormInput from './FormInput'
import QueryList from './QueryList'
import ResultList from './ResultList'

export default combineReducers({
  NavBar,
  FormInput,
  QueryList,
  ResultList
})