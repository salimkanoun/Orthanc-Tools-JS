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
                return series.ID
            })
            //Make array of new series (not already in the current series ID list)
            let newSeries = seriesToAdd.filter((series => {
                return  !(existingSeriesIDArray.includes(series.ID) )
            }))

            let studiesToAdd = action.payload.studies
            //Make array of existing studyID
            let existingStudyIDArray = state.studyArray.map(study => {
                return study.ID
            })
            //Make array of new Studies (not already in the current Study ID list)
            let newStudies = studiesToAdd.filter((study => {
                return  !(existingStudyIDArray.includes(study.ID) )
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
            let newSlipcedList = state.seriesArray.filter(series => series.ParentStudy !== action.payload)
            let newStudyArray = state.studyArray.filter(study => study.ID !== action.payload)
            return {
                seriesArray: newSlipcedList, 
                studyArray: newStudyArray
            }

        case REMOVE_SERIES_EXPORT_LIST:
            let newFilteredList = state.seriesArray.filter(series => series.ID !== action.payload)
            let newFilteredStudy = [] //remove study of the list if no more series of the study
            state.studyArray.forEach(study => {
                let find = false
                newFilteredList.forEach(series => {
                    if (study.ID === series.ParentStudy)
                        find = true
                })
                if (find)
                    newFilteredStudy.push(study)
            })
            return {
                seriesArray: newFilteredList, 
                studyArray: newFilteredStudy
            }
        default:
            return state
    }
  }