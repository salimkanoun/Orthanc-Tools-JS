export default class DicomRessources {

    Patients = {};

    addPatient = (newPatient) => {
        let PatientOrthancID = newPatient.PatientOrthancID
        if (!this.isKnownPatient(PatientOrthancID)) this.Patients[PatientOrthancID] = newPatient
    }

    isKnownPatient = (PatientOrthancID) => {
        return this.Patients[PatientOrthancID] != null
    }

    addStudy = (PatientOrthancID, newStudy) => {
        if (!this.isKnownPatient(PatientOrthancID)) throw 'Not Known Patient'
        this.Patients[PatientOrthancID].addStudy(newStudy)
    }

    addSeries = (PatientOrthancID, StudyOrthancID, newSeries) => {
        if (!this.isKnownPatient(PatientOrthancID)) throw 'Not Known Patient'
        if (this.Patients[PatientOrthancID].isKnowStudy(StudyOrthancID)) throw 'Study Not Known'
        let studyObject = this.Patients[PatientOrthancID].getStudy()
        studyObject.setSeries(newSeries)
    }

    serialize = () => {
        return Object.values(this.Patients).map((patient) => patient.serialize())
    }
}