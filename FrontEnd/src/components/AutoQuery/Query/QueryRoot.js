import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import CsvLoader from '../CsvLoader'
import { useDispatch } from 'react-redux'
import { addRow, emptyQueryTable } from '../../../actions/TableQuery'


export default () => {

    const dispatch = useDispatch()

    const removeRow = () => {
        //let selectedKeyRow = selected.map(x => x.key);
        //dispatch.removeQuery(selectedKeyRow);
    }

    const emptyTable = () => {
        dispatch(emptyQueryTable())
    }

    /*
    <ExportCSVButton data={store.queries.map(row => ({
                        'Patient Name': row.PatientName,
                        'Patient ID': row.PatientID,
                        'Accession Number': row.AccessionNumber,
                        'Date From': row.DateFrom,
                        'Date To': row.DateTo,
                        'Study Description': row.StudyDescription,
                        'Modalities': row.ModalitiesInStudy,
                        'AET': row.Aet
                    }
                    ))} />*/
    return (
        <Container fluid>
            <Row>
                <CsvLoader />
            </Row>
            <Row className="mt-3 d-flex justify-content-around">
                <input type="button" className="otjs-button otjs-button-blue w-7" value="Add Query"
                    onClick={dispatch(addRow())} />
                <Button className="otjs-button otjs-button-blue w-7">Export CSV</Button>
                <input type="button" className="otjs-button otjs-button-orange m-2 w-10" value="Delete Selected"
                    onClick={removeRow} />
                <input type="button" className="otjs-button otjs-button-red m-2 w-10" value="Empty Table"
                    onClick={emptyTable} />
            </Row>
        </Container>
    )
}