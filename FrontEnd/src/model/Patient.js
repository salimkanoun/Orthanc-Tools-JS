export default class Patient {

    PatientID = ''
    PatientOrthancID = ''
    PatientName = ''
    PatientBirthDate = ''
    PatientSex = ''
    Studies = {}

    fillFromOrthanc = (orthancId, mainDicomTags) => {
        this.PatientID = mainDicomTags.PatientID
        this.PatientName = mainDicomTags.PatientName
        this.PatientBirthDate = mainDicomTags.PatientBirthDate
        this.PatientSex = mainDicomTags.PatientSex
        this.PatientOrthancID = orthancId
    }

    getId = () => {
        return this.PatientID
    }

    getPatientID = () => {
        return this.PatientID
    }

    setPatientID = (ID) => {
        this.PatientID = ID
    }

    getOrthancID = () => {
        return this.PatientOrthancID
    }

    setOrthancID = (OrthancID) => {
        this.PatientOrthancID = OrthancID
    }

    getName = () => {
        return this.PatientName
    }

    setName = (name) => {
        this.PatientName = name
    }

    getBirthDate = () => {
        return this.PatientBirthDate
    }

    setBirthDate = (birthDate) => {
        this.PatientBirthDate = birthDate
    }

    getSex = () => {
        return this.PatientSex
    }

    setSex = (sex) => {
        this.PatientSex = sex
    }

    isKnownStudy = (StudyOrthancID) => {
        return this.Studies[StudyOrthancID] != null
    }

    addStudy = (newStudy) => {
        let StudyOrthancID = newStudy.getStudyOrthancID()
        if ( !this.isKnownStudy(StudyOrthancID)) this.Studies[StudyOrthancID] = newStudy
    }

    serialize = () => {
        return {
            PatientID: this.PatientID,
            PatientOrthancID: this.PatientOrthancID,
            PatientName: this.PatientName,
            PatientBirthDate: this.PatientBirthDate,
            PatientSex: this.PatientSex,
            Studies: Object.values(this.Studies).map(studies => studies.serialize())
        }
    }

}