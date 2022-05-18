export default class Patient {

    patientID = ''
    patientOrthancID = ''
    patientName = ''
    patientBirthDate = ''
    patientSex = ''
    studies = []

    fillFromOrthanc = (orthancId, mainDicomTags) => {
        this.patientID = mainDicomTags.PatientID
        this.patientName = mainDicomTags.PatientName
        this.patientBirthDate = mainDicomTags.PatientBirthDate
        this.patientSex = mainDicomTags.PatientSex
        this.patientOrthancID = orthancId
    }

    getId = () => {
        return this.patientID
    }

    setPatientID = (ID) => {
        this.patientID = ID
    }

    getOrthancID = () => {
        return this.patientOrthancID
    }

    setOrthancID = (OrthancID) => {
        this.patientOrthancID = OrthancID
    }

    getName = () => {
        return this.patientName
    }

    setName = (name) => {
        this.patientName = name
    }

    getBirthDate = () => {
        return this.patientBirthDate
    }

    setBirthDate = (birthDate) => {
        this.patientBirthDate = birthDate
    }

    getSex = () => {
        return this.patientSex
    }

    setSex = (sex) => {
        this.patientSex = sex
    }

    addStudy = (newStudy) => {
        let knownStudies = this.studies.filter(studies => studies.getStudyInstanceUID() === newStudy.getStudyInstanceUID())
        if (knownStudies.length > 0) throw 'Already Known Study'
        this.studies.push(newStudy)
    }

    serialize = () => {
        return {
            PatientID: this.patientID,
            PatientOrthancID: this.patientOrthancID,
            PatientName: this.patientName,
            PatientBirthDate: this.patientBirthDate,
            PatientSex: this.patientSex,
            Studies: this.studies.map(studies => studies.serialize())
        }
    }

}