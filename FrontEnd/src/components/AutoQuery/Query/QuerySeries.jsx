import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Container, Modal, Row } from 'react-bootstrap'

import Spinner from '../../CommonComponents/Spinner'
import CsvLoader from './CsvLoader'

import { addRow, emptyQueryTable, removeQuery } from '../../../actions/TableQuery'
import { useCustomQuery } from '../../../services/ReactQuery/hooks'
import apis from '../../../services/apis'
import { keys } from '../../../model/Constant'
import { dissmissToast, errorMessage, infoMessage, successMessage, updateToastMessage } from '../../../tools/toastify'
import QueryTableSeries from './QueryTableSeries'
import { addSeriesDetails } from '../../../actions/TableResult'
import EditQueriesSeries from './EditQueriesSeries'

export default ({ onQuerySeriesFinished }) => {

    const dispatch = useDispatch()

    const [queries, setQueries] = useState([])
    const [currentRow, setCurrentRow] = useState(null)
    const [selectedRowsIds, setSelectedRowsIds] = useState([])

    const { data: aets, isLoading } = useCustomQuery(
        [keys.AETS_KEY],
        () => apis.aets.getAets(),
        undefined
    )

    const onRowClick = (rowId) => {
        setCurrentRow(rowId)
    }

    const removeRows = () => {
        let remainingRows = queries.filter(query => !selectedRowsIds.includes(query.SeriesInstanceUID) )
        setQueries(remainingRows)
    }

    const onSelectRowsChange = (rowIds) => {
        setSelectedRowsIds(rowIds)
    }

    const areAllRowsAetDefined = (data) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].Aet == null || data[i].Aet == "") {
                return false
            }
        }
        return true
    }


    const queryAndAddSeriesDetails = async (studyUID, seriesUID, aet) => {
        let queryData = {
            Level: 'Series',
            Query: {
                Modality: '',
                ProtocolName: '',
                SeriesDescription: '',
                SeriesInstanceUID: seriesUID,
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

    const startFetchingSeriesDetails = async () => {

        const data = queries;

        if (!areAllRowsAetDefined(data)) {
            errorMessage('Missing AETs sources in some rows, fill it before querying')
            return
        } 

        if (data.length > 0) {
            const toastId = infoMessage('Starting Series Fetching');
            for (let i = 0; i < data.length; i++) {
                await queryAndAddSeriesDetails(data[i].StudyInstanceUID, data[i].SeriesInstanceUID, data[i].Aet)
                updateToastMessage(toastId, 'Queried series ' + (i + 1) + '/' + data.length);
            }
            dissmissToast(toastId)
            successMessage('Queries completed')
            onQuerySeriesFinished()
        }

    }

    if (isLoading) return <Spinner />

    return (
        <>
            <Container fluid>
                <Row>
                    <CsvLoader onLoad={(queries) => {setQueries(queries)}} />
                </Row>
                <Row className="m-3 d-flex justify-content-around">
                    <Button className="otjs-button otjs-button-orange w-10"
                        onClick={removeRows} >
                        Delete Selected
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
                        onClick={startFetchingSeriesDetails}
                    >
                        Search
                    </Button>
                </Row>
            </Container>
        </>
    )
}