import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Container, Row } from 'react-bootstrap'

import TableQueryResultStudies from '../../CommonComponents/RessourcesDisplay/ReactTableV8/TableQueryResultStudies'

import { exportCsv } from '../../../tools/CSVExport'

export default () => {

    const dispatch = useDispatch()

    const store = useSelector(state => {
        return {
            results: state.AutoRetrieveResultList.results,
        }
    })
    const onCSVDownload = () => {
        
        let data = Object.values(store.results).map(row => {
            return {
                'Patient Name': row.PatientName,
                'Patient ID': row.PatientID,
                'Accession Number': row.AccessionNumber,
                'Date From': row.StudyDate,
                'Date To': row.StudyDate,
                'Study Description': row.StudyDescription,
                'Modalities': row.ModalitiesInStudy,
                'AET': row.OriginAET
            }
        })
        exportCsv(data, 'csv', 'queries.csv')
    }

    return (
        <Container fluid>
            <Row className='d-flex justify-content-end'>
                <Button onClick={onCSVDownload} className="otjs-button otjs-button-blue w-10">Export CSV</Button>
            </Row>
            <Row className='mt-3'>
                < TableQueryResultStudies studies={Object.values(store.results)} />
            </Row>
        </Container>
    )
}