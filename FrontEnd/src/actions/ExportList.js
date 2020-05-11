import { ADD_EXPORT_CONTENT, EMPTY_EXPORT_LIST, REMOVE_SERIES_EXPORT_LIST, REMOVE_STUDY_EXPORT_LIST } from './actions-types'

export function addToExportList(seriesArray, studiesArray){
    return {
        type : ADD_EXPORT_CONTENT,
        payload: {
            series: seriesArray, 
            studies: studiesArray
        }
    }
}

export function emptyExportList(){
    return {
        type: EMPTY_EXPORT_LIST
    }
}

export function removeStudyFromExportList (studyID){
 return {
     type: REMOVE_STUDY_EXPORT_LIST,
     payload: studyID
 }
}

export function removeSeriesFromExportList (serieID){
    return {
        type: REMOVE_SERIES_EXPORT_LIST, 
        payload: serieID
    }
}