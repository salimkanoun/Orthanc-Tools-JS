import Patient from './Patient'
export default class Study {

    StudyID = ''
    PatientOrthancID = ''
    ReferringPhysiciansName = ''
    StudyDate = ''
    StudyDescription = ''
    StudyInstanceUID = ''
    StudyOrthancID = ''
    StudyTime = ''
    Series = []
    ParentPatient = {}

    fillFromOrthanc = (orthancID, mainDicomTags) => {
        this.StudyID = mainDicomTags.StudyID
        this.PatientOrthancID = mainDicomTags.PatientOrthancID
        this.ReferringPhysiciansName = mainDicomTags.ReferringPhysiciansName
        this.StudyDate = mainDicomTags.StudyDate
        this.StudyDescription = mainDicomTags.StudyDescription
        this.StudyInstanceUID = mainDicomTags.StudyInstanceUID
        this.AccessionNumber = mainDicomTags.AccessionNumber
        this.StudyTime = mainDicomTags.StudyTime

        this.StudyOrthancID = orthancID
    }

    fillParentFromOrthanc = (orthancID, mainDicomTags) => {
        let patient = new Patient()
        patient.fillFromOrthanc(orthancID, mainDicomTags)
        this.ParentPatient = patient
        this.PatientOrthancID = orthancID
    }

    setPatientOrthancID = (orthancID) => {
        this.PatientOrthancID = orthancID
    }

    getStudyID = () => {
        return this.StudyID
    }

    setStudyID = (studyID) => {
        this.StudyID = studyID
    }

    getPatientOrthancID = () => {
        return this.PatientOrthancID
    }

    getReferringPhysiciansName = () => {
        return this.ReferringPhysiciansName
    }

    setReferringPhysiciansName = (referringPhysiciansName) => {
        this.ReferringPhysiciansName = referringPhysiciansName
    }

    getStudyDate = () => {
        return this.StudyDate
    }

    setStudyDate = (studyDate) => {
        this.StudyDate = studyDate
    }

    getStudyDescritpion = () => {
        return this.StudyDescritpion
    }

    setStudyDescritpion = (studyDescritpion) => {
        this.StudyDescritpion = studyDescritpion
    }

    getStudyInstanceUID = () => {
        return this.StudyInstanceUID
    }

    setStudyInstanceUID = (studyInstanceUID) => {
        this.StudyInstanceUID = studyInstanceUID
    }

    getStudyOrthancID = () => {
        return this.StudyOrthancID
    }

    setStudyOrthancID = (studyOrthancID) => {
        this.StudyOrthancID = studyOrthancID
    }

    getStudyTime = () => {
        return this.StudyTime
    }

    setStudyTime = (studyTime) => {
        this.StudyTime = studyTime
    }

    addSeries = (newSeries) => {
        let knownSeries = this.Series.filter(series => series.getSeriesInstanceUID() === newSeries.getSeriesInstanceUID())
        if (knownSeries.length > 0) throw 'Already Known Series'
        this.Series.push(newSeries)
    }

    serialize = () => {
        return {
            PatientOrthancID: this.PatientOrthancID,
            AccessionNumber : this.AccessionNumber,
            ReferringPhysiciansName: this.ReferringPhysiciansName,
            StudyDate: this.StudyDate,
            StudyDescription: this.StudyDescription,
            StudyInstanceUID: this.StudyInstanceUID,
            StudyOrthancID: this.StudyOrthancID,
            StudyTime: this.StudyTime,
            Series: this.Series,
            ParentPatient : this.ParentPatient
        }
    }
}