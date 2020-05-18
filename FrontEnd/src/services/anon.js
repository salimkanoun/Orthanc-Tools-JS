import { toastifyError } from './toastify'

const anon = {

    anonymize(studyID, profile, accessionNumber, patientName, patientID, studyDescitpion){
        return fetch('/api/anonymize', {
            method: 'POST', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  "OrthancStudyID": studyID,
                "Profile" : profile,
                "AccessionNumber" : accessionNumber,
                "PatientID" : patientID,
                "PatientName" : patientName,
                "StudyDescription" : studyDescitpion 
            })
        }).then(answer => {
            if (!answer.ok) {throw answer}
            return answer.json()
        }).catch(error => {
            toastifyError(error)
        })
    }
}

export default anon