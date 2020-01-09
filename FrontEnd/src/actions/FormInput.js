import { SET_FORM_DATA, ADD_MODALITIES, ADD_QUERY_TO_LIST } from './actions-types'

export function setFormData (name, value) {
  return {
    type: SET_FORM_DATA,
    payload: { name: name, value: value }
  }
}

export function addModalities (modalities) {
  return {
    type: ADD_MODALITIES,
    payload: modalities
  }
}

export function addQueryToList (query) {
  return {
    type: ADD_QUERY_TO_LIST,
    payload: query
  }
}
