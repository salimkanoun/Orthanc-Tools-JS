import Study from "../model/Study"
import Patient from "../model/Patient"

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
    //Create Patient Key for each patient
    let patients = {}
    studiesArray.forEach(study => {
        patients[study.ParentPatient] = study.PatientMainDicomTags
    })
    let patientsObjects = Object.entries(patients).map(([orthancPatientId, PatientMainDicomTags]) => {

        let patient = new Patient()
        patient.fillFromOrthanc(orthancPatientId, PatientMainDicomTags)
        let studiesOfPatient = studiesArray.filter(study => study.ParentPatient === orthancPatientId)
        studiesOfPatient.forEach(study => {
            let studyObject = new Study()
            studyObject.fillFromOrthanc(study.ID, study.MainDicomTags)
            studyObject.fillParentFromOrthanc(study.ParentPatient, study.PatientMainDicomTags)
            patient.addStudy(studyObject)
        })

        return patient
    })
    return patientsObjects
}

export function fillPatientWithStudies(studiesArray) {
    let patients = {}
    
}

export function studyArrayToPatientArray(studiesArray) {
    //TODO
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