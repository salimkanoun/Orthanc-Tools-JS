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
    SeriesID = []
    Series = {}
    ParentPatient = {}

    fillFromOrthanc = (orthancID, mainDicomTags, SeriesOrhtancIDs) => {
        this.StudyID = mainDicomTags.StudyID
        this.PatientOrthancID = mainDicomTags.PatientOrthancID
        this.ReferringPhysiciansName = mainDicomTags.ReferringPhysiciansName
        this.StudyDate = mainDicomTags.StudyDate
        this.StudyDescription = mainDicomTags.StudyDescription
        this.StudyInstanceUID = mainDicomTags.StudyInstanceUID
        this.AccessionNumber = mainDicomTags.AccessionNumber
        this.StudyTime = mainDicomTags.StudyTime
        this.SeriesOrthancIDs = SeriesOrhtancIDs

        this.StudyOrthancID = orthancID
    }

    fillParentPatient = (PatientOrthancID, PatientMainDicomTags) => {
        let patient = new Patient()
        patient.fillFromOrthanc(PatientOrthancID, PatientMainDicomTags)
        this.ParentPatient = patient
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

    isKnownSeries = (SeriesOrthancID) => {
        return this.Series[SeriesOrthancID] != null
    }

    addSeries = (newSeries) => {
        let SeriesOrthancID = newSeries.getSeriesOrthancID();
        if( ! this.isKnownSeries(SeriesOrthancID)) this.Series[SeriesOrthancID] = newSeries
    }

    getSeriesOrthancID = () =>{
        return Object.values(this.Series).map(series => series.getSeriesOrthancID())
    }

    serialize = () => {
        return {
            PatientOrthancID: this.PatientOrthancID,
            AccessionNumber: this.AccessionNumber,
            ReferringPhysiciansName: this.ReferringPhysiciansName,
            StudyDate: this.StudyDate,
            StudyDescription: this.StudyDescription,
            StudyInstanceUID: this.StudyInstanceUID,
            StudyOrthancID: this.StudyOrthancID,
            StudyTime: this.StudyTime,
            SeriesID: this.SeriesID,
            SeriesOrthancIDs : this.SeriesOrthancIDs,
            Series: Object.values(this.Series).map(series => series.serialize()),
            ParentPatient: this.ParentPatient
        }
    }
}