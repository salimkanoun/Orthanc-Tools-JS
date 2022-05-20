export default class Patient {

    PatientID = ''
    PatientOrthancID = ''
    PatientName = ''
    PatientBirthDate = ''
    PatientSex = ''
    Studies = []

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

    addStudy = (newStudy) => {
        let knownStudies = this.Studies.filter(studies => studies.getStudyInstanceUID() === newStudy.getStudyInstanceUID())
        if (knownStudies.length > 0) throw 'Already Known Study'
        this.Studies.push(newStudy)
    }

    serialize = () => {
        return {
            PatientID: this.PatientID,
            PatientOrthancID: this.PatientOrthancID,
            PatientName: this.PatientName,
            PatientBirthDate: this.PatientBirthDate,
            PatientSex: this.PatientSex,
            Studies: this.Studies.map(studies => studies.serialize())
        }
    }

}