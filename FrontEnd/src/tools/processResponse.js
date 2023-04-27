import Study from "../model/Study"
import Patient from "../model/Patient"
import DicomRessources from "../model/DicomRessources"

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
    return dicomRessources.serialize()
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