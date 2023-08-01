import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { errorMessage, infoMessage, updateToastMessage } from "../../../tools/toastify"
import { addSeriesDetails, emptyResultsTable, removeSeriesResult } from "../../../actions/TableResult"
import ResultsSeriesTable from "./ResultsSeriesTable"

import apis from "../../../services/apis"
import { Button, Container, Modal, Row } from "react-bootstrap"
import { exportCsv } from "../../../tools/CSVExport"
import QuerySeries from "../Query/QuerySeries"

export default () => {

    const dispatch = useDispatch()

    const results = useSelector(state => state.AutoRetrieveResultList.results)
    const resultsSeries = useSelector(state => state.AutoRetrieveResultList.resultsSeries)

    const [selectedRowIds, setSelectedRowIds] = useState([])
    const [openCsvModal, setOpenCsvModal] = useState(false)

    const onCSVDownload = () => {

        let result = Object.values(resultsSeries).map(row => {
            return {
                'Patient Name': row.PatientName,
                'Patient ID': row.PatientID,
                'Accession Number': row.AccessionNumber,
                'Study Date': row.StudyDate,
                'Study Description': row.StudyDescription ,
                'Requested Procedure': row.RequestedProcedureDescription,
                'Study Instance UID' : row.StudyInstanceUID,
                'Series Instance UID': row.SeriesInstanceUID,
                'Series Description': row.SeriesDescription,
                'Modalities': row.Modality,
                'Number of Instances': row.NumberOfSeriesRelatedInstances,
                'AET': row.OriginAET
            }
        })
        exportCsv(result, 'csv', 'queries.csv')
    }

    const queryAndAddSeriesDetails = async (studyUID, aet) => {
        let queryData = {
            Level: 'Series',
            Query: {
                PatientName: '',
                PatientID: '',
                StudyDate: '',
                StudyDescription: '',
                AccessionNumber: '',
                Modality: '',
                ProtocolName: '',
                SeriesDescription: '',
                SeriesInstanceUID: '',
                StudyInstanceUID: studyUID,
                SeriesNumber: '',
                NumberOfSeriesRelatedInstances: ''
            }
        }
        try {
            let queryAnswers = await apis.query.dicomQuery(aet, queryData);
            let seriesAnswers = await apis.query.retrieveAnswer(queryAnswers['ID'])
            dispatch(addSeriesDetails(seriesAnswers, studyUID))
        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? 'Query Failure StudyInstanceUID' + studyUID)
        }
    }

    useEffect(() => {
        const startFetchingSeriesDetails = async () => {
            //List studies for each series details are missing
            let knownStudies = Object.values(results)
            let availableStudyUID = Object.values(resultsSeries).map((series) => {
                return series['StudyInstanceUID']
            })

            let missingSeriesDetails = knownStudies.filter(study => !availableStudyUID.includes(study.StudyInstanceUID))
            if (missingSeriesDetails.length > 0) {
                const toastId = infoMessage('Starting Series Fetching');
                for (let i = 0; i < missingSeriesDetails.length; i++) {
                    await queryAndAddSeriesDetails(missingSeriesDetails[i].StudyInstanceUID, missingSeriesDetails[i].OriginAET)
                    updateToastMessage(toastId, 'Queried series ' + (i + 1) + '/' + missingSeriesDetails.length);
                }
                updateToastMessage(toastId, 'Queried series Finihsed');
            }

        }
        startFetchingSeriesDetails()
    }, [])

    const selectRowHandle = (rowIds) => {
        setSelectedRowIds(rowIds)
    }

    const deleteRowsHandle = () => {
        dispatch(removeSeriesResult(selectedRowIds))
    }
    
    const emptyRowsHandle = () => {
        dispatch(emptyResultsTable(selectedRowIds))
    }

    return (
        <Container>
            <Modal size='xl' show={openCsvModal} onHide={()=>setOpenCsvModal(false)}>
                <Modal.Header closeButton/>
                <Modal.Title>Load CSV</Modal.Title>
                <Modal.Body>
                    <QuerySeries onQuerySeriesFinished={()=> setOpenCsvModal(false)}/>
                </Modal.Body>
            </Modal>
            <Row className='d-flex justify-content-around mb-3'>
            <Button className="otjs-button otjs-button-green w-10"
                        onClick={() => setOpenCsvModal(true)} >
                        Load CSV
                    </Button>
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
            <Row>
                <ResultsSeriesTable selectedRowIds={selectedRowIds} data={Object.values(resultsSeries)} onSelectRow={selectRowHandle} />
            </Row>
        </Container>
    )
}