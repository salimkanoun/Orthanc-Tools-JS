import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Container, Modal, Row } from 'react-bootstrap'
import moment from 'moment'

import Spinner from '../../CommonComponents/Spinner'
import CsvLoader from './CsvLoader'
import QueryTable from './QueryTable'

import { addRow, emptyQueryTable, removeQuery } from '../../../actions/TableQuery'
import { useCustomQuery } from '../../../services/ReactQuery/hooks'
import apis from '../../../services/apis'
import { keys } from '../../../model/Constant'
import { exportCsv } from '../../../tools/CSVExport'
import { dissmissToast, errorMessage, infoMessage, successMessage, updateToastMessage } from '../../../tools/toastify'
import { addStudyResult } from '../../../actions/TableResult'
import EditQueries from './EditQueries'
import QueryTableSeries from './QueryTableSeries'

export default ((onQuerySeriesFinished)=> {

    const [openEditModal, setOpenEditModal] = useState(false)
    const [currentRow, setCurrentRow] = useState(null)
    const [selectedRowsIds, setSelectedRowsIds] = useState([])

    const dispatch = useDispatch()

    const { data: aets, isLoading } = useCustomQuery(
        [keys.AETS_KEY],
        () => apis.aets.getAets(),
        undefined
    )
    const queries = useSelector(state => state.AutoRetrieveQueryList.queries)

    const onRowClick = (rowId) => {
        setCurrentRow(rowId)
    }

    const removeRows = () => {
        dispatch(removeQuery(selectedRowsIds));
    }

    const emptyTable = () => {
        dispatch(emptyQueryTable())
    }

    const onSelectRowsChange = (rowIds) => {
        setSelectedRowsIds(rowIds)
    }

    const onCSVDownload = () => {
        let result = Object.values(data).map(row => {
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
        exportCsv(result, 'csv', 'queriesSeries.csv')
    }

    const makeDicomQuery = async (queryParams) => {

        //Prepare POST payload for query (follow Orthanc APIs)
        let queryPost = {
            Level: 'Series',
            Query: {
                SeriesInstanceUID: queryParams.SeriesInstanceUID,
                StudyInstanceUID: queryParams.StudyInstanceUID,
            }
        }

        //Call Orthanc API to make Query
        let createQueryRessource = await apis.query.dicomQuery(queryParams.Aet, queryPost)
        //Call OrthancToolsJS API to get a parsed answer of the results
        return await apis.query.retrieveAnswer(createQueryRessource.ID)
    }

    const areAllRowsAetDefined = (data) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].Aet == null || data[i].Aet == "") {
                errorMessage('Missing AET in row ' + i + ' fill it before querying')
                return false
            }
        }
        return true
    }

    const onQueryHandle = async () => {
    
        const data = queries;

        if (!areAllRowsAetDefined(data)) return

        const toastId = infoMessage('Starting Series Queries')

        let i = 1
        for (const query of data) {
            i = i++
            updateToastMessage(toastId, 'Query series ' + i + '/' + data.length)
            //For each line make dicom query and return results
            try {
                let answeredResults = await makeDicomQuery(query)
                //For each results, fill the result table through Redux
                answeredResults.forEach((answer) => {
                    dispatch(addStudyResult(answer))
                })
            } catch (err) {
                console.error(err)
            }

        }

        dissmissToast(toastId)
        successMessage('Queries completed')
        onQuerySeriesFinished()
    }

    if (isLoading) return <Spinner />

    return (
        <>
            <Modal size='xl' show={openEditModal} onHide={()=>setOpenEditModal(false)}>
                <Modal.Header closeButton/>
                <Modal.Title>Edit Queries</Modal.Title>
                <Modal.Body>
                    <EditQueries aets={aets} selectedRowsIds={selectedRowsIds}/>
                </Modal.Body>
            </Modal>
            <Container fluid>
                <Row>
                    <CsvLoader />
                </Row>
                <Row className="m-3 d-flex justify-content-around">
                    <Button className="otjs-button otjs-button-blue w-10"
                        onClick={() => dispatch(addRow())}>
                        Add Query
                    </Button>
                    <Button onClick={onCSVDownload} className="otjs-button otjs-button-blue w-10">
                        Export CSV
                    </Button>
                    <Button className="otjs-button otjs-button-orange w-10"
                        onClick={() => setOpenEditModal(true)} >
                        Edit Selected
                    </Button>
                    <Button className="otjs-button otjs-button-orange w-10"
                        onClick={removeRows} >
                        Delete Selected
                    </Button>
                    <Button className="otjs-button otjs-button-red w-10"
                        onClick={emptyTable} >
                        Empty Table
                    </Button>
                </Row>
                <Row>
                    <QueryTableSeries
                        queries={queries}
                        aets={aets}
                        currentRow={currentRow}
                        onRowClick={onRowClick}
                        onSelectRowsChange={onSelectRowsChange}
                        selectedRowIds={selectedRowsIds}
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
        </>
    )
})