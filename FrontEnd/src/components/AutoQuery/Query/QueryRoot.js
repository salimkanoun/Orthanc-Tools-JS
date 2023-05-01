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
import { dissmissToast, errorMessage, infoMessage, successMessage, updateToast } from '../../../tools/toastify'
import { addStudyResult } from '../../../actions/TableResult'

export default ({ onQueryFinished }) => {


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
            let formattedDateFrom = typeof row.DateFrom === 'string' ? moment(new Date(row.DateFrom)).format('YYYYMMDD') : ''
            let formattedDateTo = typeof row.DateTo === 'string' ? moment(new Date(row.DateTo)).format('YYYYMMDD') : ''
            return {
                'Patient Name': row.PatientName,
                'Patient ID': row.PatientID,
                'Accession Number': row.AccessionNumber,
                'DateFrom': formattedDateFrom,
                'DateTo': formattedDateTo,
                'Study Description': row.StudyDescription,
                'Modalities': row.ModalitiesInStudy,
                'AET': row.Aet
            }
        })
        exportCsv(data, 'csv', 'queries.csv')
    }

    const makeDicomQuery = async (queryParams) => {
        //Prepare Date string for post data
        let DateString = '';
        let DateFrom = queryParams.DateFrom ? moment(new Date(queryParams.DateFrom)).format('YYYYMMDD') : null
        let DateTo = queryParams.DateTo ? moment(new Date(queryParams.DateTo)).format('YYYYMMDD') : null

        if (DateFrom !== null && DateTo !== null) {
            DateString = DateFrom + '-' + DateTo
        } else if (DateFrom === null && DateTo !== null) {
            DateString = '-' + DateTo
        } else if (DateFrom !== null && DateTo === null) {
            DateString = DateFrom + '-'
        }

        //Prepare POST payload for query (follow Orthanc APIs)
        let queryPost = {
            Level: 'Study',
            Query: {
                PatientName: queryParams.PatientName,
                PatientID: queryParams.PatientID,
                StudyDate: DateString,
                ModalitiesInStudy: queryParams.ModalitiesInStudy,
                StudyDescription: queryParams.StudyDescription,
                AccessionNumber: queryParams.AccessionNumber,
                NumberOfStudyRelatedInstances: '',
                NumberOfStudyRelatedSeries: ''
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

        const data = store.queries;

        if (!areAllRowsAetDefined(data)) return

        const toastId = infoMessage('Starting Studies Queries')

        let i = 0
        for (const query of data) {
            i++
            updateToast(toastId, 'Query study ' + i + '/' + data.length)
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
        onQueryFinished()
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