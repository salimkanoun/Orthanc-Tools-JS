import React, { useState } from 'react'

import { Container, Row } from 'react-bootstrap'

import QueryForm from './QueryForm'
import TableQueryResultStudy from './TableQueryResultStudy'

import apis from '../../services/apis'
import { errorMessage } from '../../tools/toastify'

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

    //Prepare POST payload for query (follow Orthanc APIs)
    let queryPost = {
      Level: 'Study',
      Query: {
        PatientName: formData.patientName,
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
      let answers = await apis.query.retrieveAnswer(queryAnswer['ID'])
      setStudies(answers)
    } catch (error) {
      errorMessage(error?.data?.errorMessage ?? 'Dicom Failure')
    }

  }

  return (
    <Container fluid>
      <Row>
        <QueryForm onQuery={onQuery} />
      </Row>
      <Row>
        <TableQueryResultStudy studiesData={studies} />
      </Row>
    </Container>
  )
} 
