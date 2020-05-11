import { ADD_EXPORT_CONTENT, EMPTY_EXPORT_LIST, REMOVE_SERIES_EXPORT_LIST, REMOVE_STUDY_EXPORT_LIST } from "../actions/actions-types"

const initialState = {
    exportList: [], 
    studyArray: []
}

export default function orthancContentReducer (state = initialState, action) {
    switch (action.type) {
        case ADD_EXPORT_CONTENT:
            let exportArray = action.payload.series
            //Add only series that are not already in the export list
            let newSeries = []
            exportArray.forEach(serie => {
                let find = false
                state.exportList.forEach(element => {
                    if (element.ID === serie.ID)
                        find = true
                })
                if (!find)
                    newSeries.push(serie)
            })
            let newIncresedList = [...state.exportList, ...newSeries]
            return {
                exportList : newIncresedList, 
                studyArray: action.payload.studies
            }
        case EMPTY_EXPORT_LIST:
            return {
                exportList: [], 
                studyArray: []
            }
        case REMOVE_STUDY_EXPORT_LIST:
            let newSlipcedList = state.exportList.filter(series => series.ParentStudy !== action.payload)
            let newStudyArray = state.studyArray.filter(study => study.ID !== action.payload)
            return {
                exportList: newSlipcedList, 
                studyArray: newStudyArray
            }
        case REMOVE_SERIES_EXPORT_LIST:
            let newFilteredList = state.exportList.filter(series => series.ID !== action.payload)
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
                exportList: newFilteredList, 
                studyArray: newFilteredStudy
            }
        default:
            return state
    }
  }