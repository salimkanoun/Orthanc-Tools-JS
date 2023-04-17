import { ADD_EXPORT_CONTENT, EMPTY_EXPORT_LIST, REMOVE_SERIES_EXPORT_LIST, REMOVE_STUDY_EXPORT_LIST } from "../actions/actions-types"

const initialState = {
    seriesArray: [], 
    studyArray: []
}

export default function orthancExportReducer (state = initialState, action) {
    switch (action.type) {
        case ADD_EXPORT_CONTENT:
            let seriesToAdd = action.payload.series
            //Make array of existing seriesID
            let existingSeriesIDArray = state.seriesArray.map(series => {
                return series.SeriesOrthancID
            })
            //Make array of new series (not already in the current series ID list)
            let newSeries = seriesToAdd.filter((series => {
                return  !(existingSeriesIDArray.includes(series.SeriesOrthancID) )
            }))

            let studiesToAdd = action.payload.studies
            //Make array of existing studyID
            let existingStudyIDArray = state.studyArray.map(study => {
                return study.StudyOrthancID
            })
            //Make array of new Studies (not already in the current Study ID list)
            let newStudies = studiesToAdd.filter((study => {
                return  !(existingStudyIDArray.includes(study.StudyOrthancID) )
            }))

            return {
                seriesArray : [...state.seriesArray, ...newSeries], 
                studyArray: [...state.studyArray, ...newStudies]
            }

        case EMPTY_EXPORT_LIST:
            return {
                seriesArray: [], 
                studyArray: []
            }

        case REMOVE_STUDY_EXPORT_LIST:
            let newSlipcedList = state.seriesArray.filter(series => series.StudyOrthancID !== action.payload) //parentStduy ??
            let newStudyArray = state.studyArray.filter(study => study.StudyOrthancID !== action.payload)
            return {
                seriesArray: newSlipcedList, 
                studyArray: newStudyArray
            }

        case REMOVE_SERIES_EXPORT_LIST:
            let newFilteredSeriesList = state.seriesArray.filter(series => series.SeriesOrthancID !== action.payload)
            //Create list of remaining Series Orthanc ID
            let remainingSeriesOrthancIds = newFilteredSeriesList.map(series=> series.SeriesOrthancID)
            //Filter Study in which series are not remained in series list
            let newFilteredStudyList = state.studyArray.filter(study => {
                let seriesOrthancIds = study.SeriesOrthancIDs
                return remainingSeriesOrthancIds.filter(value => seriesOrthancIds.includes(value)).length
            })
            return {
                seriesArray: newFilteredSeriesList, 
                studyArray: newFilteredStudyList
            }
        default:
            return state
    }
  }