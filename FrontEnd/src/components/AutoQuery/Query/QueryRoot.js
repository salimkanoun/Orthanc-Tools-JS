import React, { useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Container, Row } from 'react-bootstrap'

import Spinner from '../../CommonComponents/Spinner'
import CsvLoader from '../CsvLoader'
import QueryTable from './QueryTable'

import { addRow, emptyQueryTable, removeQuery } from '../../../actions/TableQuery'
import { useCustomQuery } from '../../../services/ReactQuery/hooks'
import apis from '../../../services/apis'
import { keys } from '../../../model/Constant'
import { exportCsv } from '../../../tools/CSVExport'

export default () => {


    const [currentRow, setCurrentRow] = useState(null)

    const dispatch = useDispatch()

    const { data: aets, isLoading } = useCustomQuery(
        [keys.AETS_KEY],
        () => apis.aets.getAets(),
        undefined
    )
    const store = useSelector(state => {
        return {
            queries: state.AutoRetrieveQueryList.queries
        }
    })

    const onRowClick = (rowId) => {
        setCurrentRow(rowId)
    }

    const removeRow = () => {
        dispatch(removeQuery([currentRow]));
    }

    const emptyTable = () => {
        dispatch(emptyQueryTable())
    }

    const onCSVDownload = () => {
        let data = store.queries.map(row => {
            let formattedDateFrom =  row.DateFrom instanceof Date ? moment(row.DateFrom).format('YYYYMMDD') : ''
            let formattedDateTo = row.DateTo instanceof Date ? moment(row.DateTo).format('YYYYMMDD') : ''
            return {
                'Patient Name': row.PatientName,
                'Patient ID': row.PatientID,
                'Accession Number': row.AccessionNumber,
                'Date From': formattedDateFrom,
                'Date To': formattedDateTo,
                'Study Description': row.StudyDescription,
                'Modalities': row.ModalitiesInStudy,
                'AET': row.Aet
            }
        })
        exportCsv(data, 'csv', 'queries.csv')
    }

    const onQueryHandle = () => {

    }

    if (isLoading) return <Spinner />
    return (
        <Container fluid>
            <Row>
                <CsvLoader />
            </Row>
            <Row className="m-3 d-flex justify-content-around">
                <input type="button" className="otjs-button otjs-button-blue w-10" value="Add Query"
                    onClick={() => dispatch(addRow())} />
                <Button onClick={onCSVDownload} className="otjs-button otjs-button-blue w-10">Export CSV</Button>
                <input type="button" className="otjs-button otjs-button-orange w-10" value="Delete Selected"
                    onClick={removeRow} />
                <input type="button" className="otjs-button otjs-button-red w-10" value="Empty Table"
                    onClick={emptyTable} />
            </Row>
            <Row>
                <QueryTable
                    queries={store.queries}
                    aets={aets}
                    currentRow={currentRow}
                    onRowClick={onRowClick}
                />
            </Row>
            <Row className="d-flex justify-content-center mt-5">
                <Button
                    className="otjs-button otjs-button-blue"
                    onClick={onQueryHandle}
                >
                    Query
                </Button>
            </Row>
        </Container>
    )
}