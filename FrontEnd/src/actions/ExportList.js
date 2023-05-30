import { ADD_EXPORT_CONTENT, EMPTY_EXPORT_LIST, REMOVE_SERIES_EXPORT_LIST, REMOVE_STUDY_EXPORT_LIST } from './actions-types'
import apis from '../services/apis'
import Series from '../model/Series'
import { errorMessage } from '../tools/toastify'
import Study from '../model/Study'

export function addToExportList(seriesArray, studiesArray) {
    return {
        type: ADD_EXPORT_CONTENT,
        payload: {
            series: seriesArray,
            studies: studiesArray
        }
    }
}

export function addSeriesToExportList(seriesArray) {
    return async function (dispatch) {
        for (const seriesObject of seriesArray) {
            try {
                let studyDetails = await apis.content.getStudiesDetails(seriesObject.StudyOrthancID)
                let study = new Study()
                study.fillFromOrthanc(studyDetails.ID, studyDetails.MainDicomTags, studyDetails.Series)
                study.fillParentPatient(studyDetails.ParentPatient, studyDetails.PatientMainDicomTags)
                const studyObject = study.serialize()

                dispatch(
                    {
                        type: ADD_EXPORT_CONTENT,
                        payload: {
                            series: seriesArray,
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

/**
 * From a study level, fetch series data and dispatch it to redux to 
 * send the exported study ressource
 * @param {*} studiesArray 
 */
export function addStudiesToExportList(studiesArray) {
    return async function (dispatch) {
        for (const studyObject of studiesArray) {
            try {
                let seriesInfo = await apis.content.getSeriesDetailsOfStudy(studyObject.StudyOrthancID)
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