import { ADD_EXPORT_CONTENT, EMPTY_EXPORT_LIST, REMOVE_SERIES_EXPORT_LIST, REMOVE_STUDY_EXPORT_LIST } from "../actions/actions-types"

const initialState = {
    exportList: []
}

export default function orthancContentReducer (state = initialState, action) {
    switch (action.type) {
        case ADD_EXPORT_CONTENT:
            let exportArray = action.payload
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
                exportList : newIncresedList
            }
        case EMPTY_EXPORT_LIST:
            return {
                exportList: []
            }
        case REMOVE_STUDY_EXPORT_LIST:
            let newSlipcedList = state.exportList.filter(series => series.ParentStudy !== action.payload)
            return {
                exportList: newSlipcedList
            }
        case REMOVE_SERIES_EXPORT_LIST:
            let newFilteredList = state.exportList.filter(series => series.ID !== action.payload)
            return {
                exportList: newFilteredList
            }
        default:
            return state
    }
  }