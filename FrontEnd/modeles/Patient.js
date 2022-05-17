class Patient {

    constructor() {
        this.patientId = ''
        this.patientOrthancId = ''
        this.patientName = ''
        this.patientBirthDate = ''
        this.patientSex = ''
    }

    getId() {
        return this.patientId
    }

    setId(id) {
        this.patientId = id
    }

    getOrthancId() {
        return this.patientOrthancId
    }

    setOrthancId(OrthancId) {
        this.patientOrthancId = OrthancId
    }

    getName() {
        return this.patientName
    }

    setName(name) {
        this.patientName = name
    }

    getBirthDate() {
        return this.patientBirthDate
    }

    setBirthDate(birthDate) {
        this.patientBirthDate = birthDate
    }

    getSex() {
        return this.patientSex
    }
    
    setSex(sex) {
        this.patientSex = sex
    }

}