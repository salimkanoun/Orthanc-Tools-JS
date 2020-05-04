
export function treeToPatientArray(patientStudiesTree){
    let answer = []
    for(let patient in patientStudiesTree) {
        answer.push( {
            PatientOrthancID  : patient,
            ...patientStudiesTree[patient]
        })
    }
    return answer
  }

export function studyArrayToNestedData(studiesArray){
    let responseMap = []
    //Create Patient Key for each patient
    studiesArray.forEach(study => {
        responseMap[study.ParentPatient]={
            studies : {}
        }
    })
    //For each study create a study entry in the parent patient
    studiesArray.forEach(study => {
        responseMap[study.ParentPatient]['studies'][study.ID] = {
            ...study.MainDicomTags
        }
        //Merge the new study entry with the existing one for this patient
        responseMap[study.ParentPatient] = {...study.PatientMainDicomTags, ...responseMap[study.ParentPatient]}
    })
    
    return responseMap
      
  }

  export function studyArrayToPatientArray(studiesArray){
      console.log(studiesArray)
    let nestedData = studyArrayToNestedData(studiesArray)
    return treeToPatientArray(nestedData)
  }