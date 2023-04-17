import Study from "../model/Study"
import Patient from "../model/Patient"
import DicomRessources from "../model/DicomRessources"

export function treeToPatientArray(patientStudiesTree) {
    let answer = []
    for (let patient in patientStudiesTree) {
        answer.push({
            PatientOrthancID: patient,
            ...patientStudiesTree[patient]
        })
    }
    return answer
}

export function fillPatientModelWithStudies(studiesArray) {
    let dicomRessources = new DicomRessources()
    studiesArray.forEach(study => {
        let patientObject = new Patient()
        patientObject.fillFromOrthanc(study.ParentPatient, study.PatientMainDicomTags)
        dicomRessources.addPatient(patientObject)
        let studyObject = new Study()
        studyObject.fillFromOrthanc(study.ID, study.MainDicomTags, study.Series)
        studyObject.fillParentPatient(study.ParentPatient, study.PatientMainDicomTags)

        dicomRessources.addStudy(study.ParentPatient, studyObject)

    })

    return dicomRessources
}

export function studyArrayToPatientArray(studiesArray) {
        let patientRows = {}
        studiesArray.forEach(study => {
            patientRows[study.ParentPatient.PatientOrthancID] = {
                ...study.ParentPatient,
                Studies: []
            }
        })

        studiesArray.forEach(study => {
            patientRows[study.ParentPatient.PatientOrthancID].Studies.push(study)
        })
        let responsePatientRows = Object.values(patientRows)
        return responsePatientRows
}

//////////////////////////////////////////////////////////////////////////////////////

export function treeToStudyArray(studySeriesTree) {
    let answer = []
    for (let study in studySeriesTree) {
        answer.push({
            StudyOrthancID: study,
            ...studySeriesTree[study]
        })
    }
    return answer
}

export function seriesArrayToNestedData(seriesArray, studyDetails) {
    let responseMap = []
    //create study key for each study
    seriesArray.forEach(serie => {
        responseMap[serie.ParentStudy] = {
            series: {}
        }
    })
    //for each serie create a serie entry in the parent study
    seriesArray.forEach(serie => {
        responseMap[serie.ParentStudy].series[serie.ID] = {
            ...serie.MainDicomTags,
            Instances: serie.Instances.length
        }
        //merge the new serie entry with the existing one for this study
        studyDetails.forEach(study => {
            if (study.ID === serie.ParentStudy) {
                responseMap[serie.ParentStudy] = {
                    ...study.MainDicomTags,
                    ...responseMap[serie.ParentStudy],
                    ...study.PatientMainDicomTags,
                    AnonymizedFrom: study.AnonymizedFrom
                }
            }
        })
    })

    return responseMap
}

/**
 * 
 * @param {array} seriesArray series Details 
 * @param {array} studyArray study Details
 */
export function seriesArrayToStudyArray(seriesArray, studyArray) {
    let nestedData = seriesArrayToNestedData(seriesArray, studyArray)
    return treeToStudyArray(nestedData)
}