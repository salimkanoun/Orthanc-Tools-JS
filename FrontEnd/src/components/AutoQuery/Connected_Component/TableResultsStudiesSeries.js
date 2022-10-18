import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Col, Row } from 'react-bootstrap'
import apis from '../../../services/apis';
import {
    commonColumns,
    patientColumns,
    seriesColumns,
    studyColumns
} from "../../CommonComponents/RessourcesDisplay/ReactTable/ColumnFactories";
import CommonSelectingSortingFilteringTable
    from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonSelectingSortingFilteringTable";

/**
 * Show Series details of studies results
 */
export default ({
    results,
    resultsSeries,
}) => {

    const [selected, setSelected] = useState([]);

    const dispatch = useDispatch()

    const store = useSelector(state => {
        return {
            results: state.AutoRetrieveResultList.results,
            resultsSeries: state.AutoRetrieveResultList.resultsSeries
        }
    })

    const getSeriesDetails = async (studyUID, aet) => {
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
        let queryAnswers = await apis.query.dicomQuery(aet, queryData);
        let seriesAnswers = await apis.query.retrieveAnswer(queryAnswers['ID'])
        dispatch.addSeriesDetails(seriesAnswers, studyUID)
    }


    useEffect(() => {
        //List studies for each series details are missing
        let emptyResultArray = []
        let studyUIDToQuery = Object.keys(store.results)
        let availableStudyUID = []
        for (let seriesUID of Object.keys(store.resultsSeries)) {
            availableStudyUID.push(store.resultsSeries[seriesUID]['StudyInstanceUID'])
        }
        studyUIDToQuery.forEach(studyUID => {
            if (!availableStudyUID.includes(studyUID)) emptyResultArray.push(store.results[studyUID])
        })
        if (emptyResultArray.length > 0) {
            const id = toast.info('Starting Series Fetching');
            emptyResultArray.reduce((prev, studyResults, i) => {
                return prev.then(() => {
                    return getSeriesDetails(studyResults.StudyInstanceUID, studyResults.OriginAET).then(() => {
                        toast.update(id, {
                            render: 'Queried series ' + (i + 1) + '/' + emptyResultArray.length
                        });
                    })
                })
            }, Promise.resolve()).catch(console.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const columns = useMemo(() => [
        commonColumns.RAW,
        studyColumns.ORTHANC_ID,
        studyColumns.INSTANCE_UID,
        patientColumns.PARENT_NAME(),
        patientColumns.PARENT_ID(),
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        studyColumns.ACCESSION_NUMBER,
        seriesColumns.SERIES_NUMBER,
        seriesColumns.MODALITY,
        seriesColumns.NB_SERIES_INSTANCES,
        commonColumns.AET,
    ], []);

    const data = useMemo(() => {
        let seriesLines = []
        for (let seriesUID of Object.keys(store.resultsSeries)) {
            seriesLines.push({
                ...store.results[store.resultsSeries[seriesUID]['StudyInstanceUID']],
                ...store.resultsSeries[seriesUID],
                raw: {
                    ...store.results[store.resultsSeries[seriesUID]['StudyInstanceUID']],
                    ...store.resultsSeries[seriesUID],
                }
            })
        }
        return seriesLines
    }, [store.results, store.resultsSeries])

    return (
        <Fragment>
            <Row className="text-center">
                <Col>
                    <input type="button" className="otjs-button otjs-button-orange w-10 me-4" value="Delete Selected"
                        onClick={() => {
                            dispatch.removeSeriesResult(selected.map(x => x.values.raw.SeriesInstanceUID));
                        }} />
                    <input type="button" className="otjs-button otjs-button-red w-10 ms-4" value="Empty Table"
                        onClick={dispatch.emptyResultsTable} />
                </Col>
            </Row>
            <Row className="mt-5 text-center">
                <CommonSelectingSortingFilteringTable tableData={data} columns={columns} onSelect={setSelected}
                    onFilter={(filtered => {
                        let filteredSeriesUID = filtered.map(row => row.values.raw.SeriesInstanceUID)
                        dispatch.addSeriesFiltered(filteredSeriesUID)
                    })} pagination />
            </Row>
        </Fragment>
    )
}

