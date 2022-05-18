import Patient from './Patient'
export default class Study {

    studyID = ''
    patientOrthancID = ''
    referringPhysiciansName = ''
    studyDate = ''
    studyDescription = ''
    studyInstanceUID = ''
    studyOrthancID = ''
    studyTime = ''
    series = []
    parentPatient = {}

    fillFromOrthanc = (orthancID, mainDicomTags) => {
        this.studyID = mainDicomTags.StudyID
        this.patientOrthancID = mainDicomTags.PatientOrthancID
        this.referringPhysiciansName = mainDicomTags.ReferringPhysiciansName
        this.studyDate = mainDicomTags.StudyDate
        this.studyDescription = mainDicomTags.StudyDescription
        this.studyInstanceUID = mainDicomTags.StudyInstanceUID
        this.accessionNumber = mainDicomTags.AccessionNumber
        this.studyTime = mainDicomTags.SstudyTime

        this.studyOrthancID = orthancID
    }

    fillParentFromOrthanc = (orthancID, mainDicomTags) => {
        let patient = new Patient()
        patient.fillFromOrthanc(orthancID, mainDicomTags)
        this.parentPatient = patient


    }

    setPatientOrthancID = (orthancID) => {
        this.patientOrthancID = orthancID
    }

    getStudyID = () => {
        return this.studyID
    }

    setStudyID = (studyID) => {
        this.studyID = studyID
    }

    getPatientOrthancID = () => {
        return this.patientOrthancID
    }

    getReferringPhysiciansName = () => {
        return this.referringPhysiciansName
    }

    setReferringPhysiciansName = (referringPhysiciansName) => {
        this.referringPhysiciansName = referringPhysiciansName
    }

    getStudyDate = () => {
        return this.studyDate
    }

    setStudyDate = (studyDate) => {
        this.studyDate = studyDate
    }

    getStudyDescritpion = () => {
        return this.studyDescritpion
    }

    setStudyDescritpion = (studyDescritpion) => {
        this.studyDescritpion = studyDescritpion
    }

    getStudyInstanceUID = () => {
        return this.studyInstanceUID
    }

    setStudyInstanceUID = (studyInstanceUID) => {
        this.studyInstanceUID = studyInstanceUID
    }

    getStudyOrthancID = () => {
        return this.studyOrthancID
    }

    setStudyOrthancID = (studyOrthancID) => {
        this.studyOrthancID = studyOrthancID
    }

    getStudyTime = () => {
        return this.studyTime
    }

    setStudyTime = (studyTime) => {
        this.studyTime = studyTime
    }

    addSeries = (newSeries) => {
        let knownSeries = this.series.filter(series => series.getSeriesInstanceUID() === newSeries.getSeriesInstanceUID())
        if (knownSeries.length > 0) throw 'Already Known Series'
        this.series.push(newSeries)
    }

    serialize = () => {
        return {
            PatientOrthancID: this.patientOrthancID,
            AccessionNumber : this.accessionNumber,
            ReferringPhysiciansName: this.referringPhysiciansName,
            StudyDate: this.studyDate,
            StudyDescription: this.studyDescription,
            StudyInstanceUID: this.studyInstanceUID,
            StudyOrthancID: this.studyOrthancID,
            StudyTime: this.studyTime,
            Series: this.series,
            ParentPatient : this.parentPatient
        }
    }
}