import { ADD_EXPORT_CONTENT, EMPTY_EXPORT_LIST, REMOVE_SERIES_EXPORT_LIST, REMOVE_STUDY_EXPORT_LIST } from './actions-types'
import apis from '../services/apis'
import Series from '../model/Series'
import { errorMessage } from '../tools/toastify'

export function addToExportList(seriesArray, studiesArray) {
    return {
        type: ADD_EXPORT_CONTENT,
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
export function addStudiesToExportList(studiesArray) {
    return async function (dispatch) {
        for (const studyObject of studiesArray) {
            try {
                let seriesInfo = await apis.content.getSeriesDetailsOfStudy(studyObject['StudyOrthancID'])
                let series = seriesInfo.map(series => {
                    let seriesObject = new Series()
                    seriesObject.fillFromOrthanc(series.ID, series.MainDicomTags, series.Instances, series.ParentStudy)
                    return seriesObject.serialize()
                })

                dispatch(
                    {
                        type: ADD_EXPORT_CONTENT,
                        payload: {
                            series: series,
                            studies: [studyObject]
                        }
                    }
                )
            } catch (error) {
                errorMessage(error?.data?.errorMessage ?? "Series Details Fetching Failed")
            }

        }
    }
}

export function emptyExportList() {
    return {
        type: EMPTY_EXPORT_LIST
    }
}

export function removeStudyFromExportList(studyID) {
    return {
        type: REMOVE_STUDY_EXPORT_LIST,
        payload: studyID
    }
}

export function removeSeriesFromExportList(serieID) {
    return {
        type: REMOVE_SERIES_EXPORT_LIST,
        payload: serieID
    }
}