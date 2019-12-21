import { ADD_AET, SET_FORM_DATA, ADD_MODALITIES } from '../actions/actions-types'

const initialState = {
  lastName: '',
  firstName: '',
  patientId: '',
  accessionNumber: '',
  studyDescription: '',
  dateFrom: '',
  dateTo: '',
  aets: [],
  aetsObject: [],
  modalities: []
}

export default function formInputReducer (state = initialState, action) {
  switch (action.type) {
    case ADD_AET :
      const aetsObject = []
      action.payload.forEach((aet) => {
        aetsObject.push({
          value: aet,
          label: aet
        })
      })
      return {
        ...state,
        aets: action.payload,
        aetsObject: aetsObject
      }
    case SET_FORM_DATA :
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    case ADD_MODALITIES :
      const modalities = action.payload.map(a => a.value)
      return {
        ...state,
        modalities: modalities
      }
    default :
      return state
  }
}
