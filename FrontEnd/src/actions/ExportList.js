import { ADD_EXPORT_CONTENT, EMPTY_EXPORT_LIST, REMOVE_SERIES_EXPORT_LIST, REMOVE_STUDY_EXPORT_LIST } from './actions-types'
import apis from '../services/apis'
import Series from '../model/Series'

export function addToExportList(seriesArray, studiesArray){
    return {
        type : ADD_EXPORT_CONTENT,
        payload: {
            series: seriesArray, 
            studies: studiesArray
        }
    }
}

/**
 * From a study level, fetch series data and dispatch it to redux to 
 * send the exported study ressource
 * @param {*} studiesArray 
 */
export function addStudiesToExportList(studiesArray){
    return async function(dispatch) {
        for (const studyObject of studiesArray){
            let seriesInfo = await apis.content.getSeriesDetails(studyObject['StudyOrthancID'])   
            let series = seriesInfo.map(series => {
                let seriesObject = new Series()
                seriesObject.fillFromOrthanc(series.ID, series.MainDicomTags, series.Instances, series.ParentStudy )
                return seriesObject
            })
           
            dispatch( 
                {
                    type : ADD_EXPORT_CONTENT,
                    payload: {
                        series: series, 
                        studies: [studyObject]
                    }
                }
            )
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