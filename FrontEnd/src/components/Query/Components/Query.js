import React, { useState } from 'react'
import QueryForm from '../Connected_Components/QueryForm'
import TableResultStudy from '../Connected_Components/TableResultStudy'
import { Row } from 'react-bootstrap'
import apis from '../../../services/apis'
import { toast } from 'react-toastify'

export default () => {

  const [studies, setStudies] = useState([])

  
  const onQuery = async (formData, aet) => {

    let dateFrom = formData.dateFrom
    let dateTo = formData.dateTo

    //Prepare Date string for post data
    let dateString = '';
    dateFrom = dateFrom.split('-').join('')
    dateTo = dateTo.split('-').join('')
    if (dateFrom !== '' && dateTo !== '') {
      dateString = dateFrom + '-' + dateTo
    } else if (dateFrom === '' && dateTo !== '') {
      dateString = '-' + dateTo
    } else if (dateFrom !== '' && dateTo === '') {
      dateString = dateFrom + '-'
    }

    let patientName = ''

    let inputLastName = formData.lastName
    let inputFirstName = formData.firstName

    if (inputLastName === '' && inputFirstName !== '') {
      patientName = '^' + inputFirstName
    } else if (inputLastName !== '' && inputFirstName === '') {
      patientName = inputLastName
    } else if (inputLastName !== '' && inputFirstName !== '') {
      patientName = inputLastName + '^' + inputFirstName
    }

    //Prepare POST payload for query (follow Orthanc APIs)
    let queryPost = {
      Level: 'Study',
      Query: {
        PatientName: patientName,
        PatientID: formData.patientID,
        StudyDate: dateString,
        ModalitiesInStudy: formData.modalities,
        StudyDescription: formData.studyDescription,
        AccessionNumber: formData.accessionNumber,
        NumberOfStudyRelatedInstances: '',
        NumberOfStudyRelatedSeries: ''
      }
    }


    try {
      let queryAnswer = await apis.query.dicomQuery(aet, queryPost)
      console.log('queryAnswer : ', queryAnswer)
      let answers = await apis.query.retrieveAnswer(queryAnswer['ID'])
      console.log('answers : ', answers)
      setStudies(answers)
      
    } catch (error) {
        toast.error('Dicom Failure')
    }

  }

  console.log('studies :', studies)
  return (
    <div>
      <Row>
        <QueryForm onQuery={onQuery}/>
      </Row>
      <Row>
        <TableResultStudy studiesData={studies} />
      </Row>
    </div>
  )
} 
