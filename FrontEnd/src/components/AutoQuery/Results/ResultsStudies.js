import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Container, Row } from 'react-bootstrap'

import { emptyResultsTable, removeResult } from '../../../actions/TableResult'
import ResultsStudiesTable from './ResultsStudiesTable'
import { exportCsv } from '../../../tools/CSVExport'

export default () => {

    const dispatch = useDispatch()

    const store = useSelector(state => {
        return {
            results: state.AutoRetrieveResultList.results,
        }
    })

    const [selectedRowIds, setSelectedRowIds] = useState([])

    const onCSVDownload = () => {

        let data = Object.values(store.results).map(row => {
            return {
                'Patient Name': row.PatientName,
                'Patient ID': row.PatientID,
                'Accession Number': row.AccessionNumber,
                'DateFrom': row.StudyDate,
                'DateTo': row.StudyDate,
                'Study Description': row.StudyDescription,
                'Modalities': row.ModalitiesInStudy,
                'AET': row.OriginAET
            }
        })
        exportCsv(data, 'csv', 'queries.csv')
    }

    const selectRowHandle = (rowIds) => {
        setSelectedRowIds(rowIds)
    }

    const deleteRowsHandle = () => {
        dispatch(removeResult(selectedRowIds))
    }

    const emptyRowsHandle = () => {
        dispatch(emptyResultsTable())
    }

    return (
        <Container fluid>
            <Row className='d-flex justify-content-around mb-3'>
                <Button onClick={onCSVDownload} className="otjs-button otjs-button-blue w-10">Export CSV</Button>
                <Button className="otjs-button otjs-button-orange w-10"
                    onClick={deleteRowsHandle} >
                    Delete Selected
                </Button>
                <Button className="otjs-button otjs-button-red w-10"
                    onClick={emptyRowsHandle} >
                    Empty Table
                </Button>
            </Row>
            <Row className='mb-3'>
                <ResultsStudiesTable onSelectRow={selectRowHandle} studies={Object.values(store.results)} selectedRowIds={selectedRowIds} />
            </Row>
        </Container>
    )
}