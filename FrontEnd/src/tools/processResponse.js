
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
    let nestedData = studyArrayToNestedData(studiesArray)
    return treeToPatientArray(nestedData)
  }

  //////////////////////////////////////////////////////////////////////////////////////

  export function treeToStudyArray(studySeriesTree){
    let answer = []
    for(let study in studySeriesTree) {
        answer.push( {
            StudyOrthancID  : study,
            ...studySeriesTree[study]
        })
    }
    return answer
  }

  export function seriesArrayToNestedData(seriesArray, orthancContent){
    let responseMap = []
    //create study key for each study
    seriesArray.forEach(serie => {
        responseMap[serie.ParentStudy]={
            series: {}
        }
    })
    //for each serie create a serie entry in the parent study
    seriesArray.forEach(serie => {
        responseMap[serie.ParentStudy].series[serie.ID] = {
            ...serie.MainDicomTags, 
            Instances: serie.Instances.length
        }
        //merge the new serie entry with the existing one for this study
        orthancContent.forEach(study => {
            if (study.ID === serie.ParentStudy){
                responseMap[serie.ParentStudy] = {
                    ...study.MainDicomTags, 
                    ...responseMap[serie.ParentStudy], 
                    ...study.PatientMainDicomTags
                }
            }
        })
    })

    return responseMap
  }


  export function seriesArrayToStudyArray(seriesArray, orthancContent){
    let nestedData = seriesArrayToNestedData(seriesArray, orthancContent)
    return treeToStudyArray(nestedData)
  }