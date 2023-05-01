import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Container, Row } from 'react-bootstrap'

import TableQueryResultStudies from '../../CommonComponents/RessourcesDisplay/ReactTableV8/TableQueryResultStudies'

import { exportCsv } from '../../../tools/CSVExport'
import { emptyResultsTable, removeResult } from '../../../actions/TableResult'
import moment from 'moment'

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
                'DateFrom': row.StudyDate ? moment(row.StudyDate).format('YYYYMMDD') : '',
                'DateTo': row.StudyDate ? moment(row.StudyDate).format('YYYYMMDD') : '',
                'Study Description': row.StudyDescription,
                'Modalities': row.ModalitiesInStudy,
                'AET': row.OriginAET
            }
        })
        exportCsv(data, 'csv', 'queries.csv')
    }
    //SK TODO SELECTION DES RESSOURCE A REMOVE
    const selected = []
    return (
        <Container fluid>
            <Row className='mb-3'>
                < TableQueryResultStudies studies={Object.values(store.results)} />
            </Row>
            <Row className='d-flex justify-content-end mb-3'>
                <Button onClick={onCSVDownload} className="otjs-button otjs-button-blue w-10">Export CSV</Button>
                <Button className="otjs-button otjs-button-orange w-10"
                    onClick={() => {
                        dispatch(removeResult(selected.map(x => x.values.StudyInstanceUID)))
                    }} >
                    Delete Selected
                </Button>
                <Button className="otjs-button otjs-button-red w-10"
                    onClick={() => dispatch(emptyResultsTable())} >
                    Empty Table
                </Button>
            </Row>
        </Container>
    )
}