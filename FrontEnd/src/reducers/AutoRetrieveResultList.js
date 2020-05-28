import { AQ_ADD_STUDY_RESULT, AQ_ADD_SERIES_DETAILS, AQ_REMOVE_STUDY_RESULT, AQ_REMOVE_SERIES_RESULT, AQ_EMPTY_RESULTS } from '../actions/actions-types'

const initialState = {
  results: {},
  resultsSeries : {}
}

export default function retrieveListReducer (state = initialState, action) {
  switch (action.type) {

    case AQ_ADD_STUDY_RESULT:
      const studyInstanceUid = action.payload.studyInstanceUID;
      let newResultObject = {...state.results}

      newResultObject[studyInstanceUid]= {
        isRetrieved: false,
        ...action.payload
      }

      return {
        ...state,
        results : newResultObject
      }
    
    case AQ_REMOVE_STUDY_RESULT :
      let resultsCopy = {...state.results}
      //Remove selected studies from studies object
      const removedLines = action.payload
      removedLines.forEach(studyInstanceUID =>{
          delete resultsCopy[studyInstanceUID]
      })

      //Remove child series of these studies
      let resultSeriesCopy3 = {...state.resultsSeries}
      let existingSeriesUID = Object.keys(resultSeriesCopy3)
      existingSeriesUID.forEach(seriesUID => {
         if(! removedLines.includes(seriesUID)){
           delete resultSeriesCopy3[seriesUID]
         }
      })

      return {
        resultsSeries : resultSeriesCopy3,
        results: resultsCopy
      }

    case AQ_EMPTY_RESULTS :
      return {
        results: [],
        resultsSeries : [],
      }

    case AQ_ADD_SERIES_DETAILS :
      const seriesDetails = action.payload.seriesDetails

      let resultSeriesCopy = {...state.resultsSeries}
      seriesDetails.forEach(series =>{
        resultSeriesCopy[series.seriesInstanceUID] = {
          ...series,
          isRetrieved : false
        }
      })

      return {
        ...state,
        resultsSeries: resultSeriesCopy
      }

    case AQ_REMOVE_SERIES_RESULT :
      //SK ICI A REVOIR
      let seriesUIDToDelete = action.payload
      console.log(seriesUIDToDelete)
      let resultSeriesCopy2 = {...state.resultsSeries}
      //Remove series from series Object
      seriesUIDToDelete.forEach(seriesUID => {
        delete resultSeriesCopy2[seriesUID]
      })
      //List remaining StudyUID in this new list
      let remainingStudyUIDInSeries = Object.keys(resultSeriesCopy2).map( seriesUID =>{
        return resultSeriesCopy2[seriesUID]['studyInstanceUID']
      })
      //Get unique remaining StudyUID
      remainingStudyUIDInSeries = [...new Set(remainingStudyUIDInSeries)]

      console.log(remainingStudyUIDInSeries)
      
      let resultStudiesCopy = {...state.results}
      let studyUIDArray = Object.keys(resultStudiesCopy)
      let studiesUIDToRemove = studyUIDArray.filter(studyUID => !remainingStudyUIDInSeries.includes(studyUID));
      studiesUIDToRemove.forEach(studyUID =>{
          delete resultStudiesCopy[studyUID]
      })

      return {
        ...state,
        results : resultStudiesCopy,
        resultsSeries: resultSeriesCopy2
      }


    default :
      return state
  }

}
