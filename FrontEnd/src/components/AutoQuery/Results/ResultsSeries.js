import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { errorMessage, infoMessage, updateToast } from "../../../tools/toastify"
import { addSeriesDetails, emptyResultsTable, removeSeriesResult } from "../../../actions/TableResult"
import ResultsSeriesTable from "./ResultsSeriesTable"

import apis from "../../../services/apis"
import { Button, Container, Row } from "react-bootstrap"

export default () => {

    const dispatch = useDispatch()

    const results = useSelector(state => state.AutoRetrieveResultList.results)
    const resultsSeries = useSelector(state => state.AutoRetrieveResultList.resultsSeries)

    const data = useMemo(() => {
        let seriesLines = []
        for (let seriesUID of Object.keys(resultsSeries)) {
            seriesLines.push({
                ...results[resultsSeries[seriesUID]['StudyInstanceUID']],
                ...resultsSeries[seriesUID],
            })
        }
        return seriesLines
    }, [Object.values(results), Object.values(resultsSeries)])

    const [selectedRowIds, setSelectedRowIds] = useState([])

    const queryAndAddSeriesDetails = async (studyUID, aet) => {
        let queryData = {
            Level: 'Series',
            Query: {
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
            let emptyResultArray = []
            let knownStudies = Object.values(results)
            let availableStudyUID = Object.values(resultsSeries).map((series) => {
                return series['StudyInstanceUID']
            })

            let missingSeriesDetails = knownStudies.filter(study => !availableStudyUID.includes(study.StudyInstanceUID))
            if (missingSeriesDetails.length > 0) {
                const toastId = infoMessage('Starting Series Fetching');
                for (let i = 0; i < missingSeriesDetails.length; i++) {
                    await queryAndAddSeriesDetails(missingSeriesDetails[i].StudyInstanceUID, missingSeriesDetails[i].OriginAET)
                    updateToast(toastId, 'Queried series ' + (i + 1) + '/' + emptyResultArray.length);
                }
                updateToast(toastId, 'Queried series Finihsed');
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
            <Row className='d-flex justify-content-around mb-3'>
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
                <ResultsSeriesTable selectedRowIds={selectedRowIds} data={data} onSelectRow={selectRowHandle} />
            </Row>
        </Container>
    )
}