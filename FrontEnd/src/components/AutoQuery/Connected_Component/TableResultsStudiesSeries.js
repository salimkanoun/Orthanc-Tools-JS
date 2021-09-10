import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux'
import {toast} from 'react-toastify'
import {Col, Row} from 'react-bootstrap'
import {addSeriesDetails, addSeriesFiltered, emptyResultsTable, removeSeriesResult} from '../../../actions/TableResult'
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
function TableResultsStudiesSeries({
                                       addSeriesDetails,
                                       emptyResultsTable,
                                       removeSeriesResult,
                                       results,
                                       resultsSeries,
                                       addSeriesFiltered
                                   }) {
    const [selected, setSelected] = useState([]);

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
        addSeriesDetails(seriesAnswers, studyUID)
    }


    useEffect(() => {
        //List studies for each series details are missing
        let emptyResultArray = []
        let studyUIDToQuery = Object.keys(results)
        let availableStudyUID = []
        for (let seriesUID of Object.keys(resultsSeries)) {
            availableStudyUID.push(resultsSeries[seriesUID]['StudyInstanceUID'])
        }
        studyUIDToQuery.forEach(studyUID => {
            if (!availableStudyUID.includes(studyUID)) emptyResultArray.push(results[studyUID])
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
        patientColumns.NAME(),
        patientColumns.ID(),
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
        for (let seriesUID of Object.keys(resultsSeries)) {
            seriesLines.push({
                ...results[resultsSeries[seriesUID]['StudyInstanceUID']],
                ...resultsSeries[seriesUID],
                raw: {
                    ...results[resultsSeries[seriesUID]['StudyInstanceUID']],
                    ...resultsSeries[seriesUID],
                }
            })
        }
        return seriesLines
    }, [results, resultsSeries])

    return (
        <Fragment>
            <Row className="text-center">
                <Col>
                    <input type="button" className="otjs-button otjs-button-orange w-10 me-4" value="Delete Selected"
                           onClick={() => {
                               removeSeriesResult(selected.map(x => x.values.raw.SeriesInstanceUID));
                           }}/>
                    <input type="button" className="otjs-button otjs-button-red w-10 ms-4" value="Empty Table"
                           onClick={emptyResultsTable}/>
                </Col>
            </Row>
            <Row className="mt-5 text-center">
                <CommonSelectingSortingFilteringTable tableData={data} columns={columns} onSelect={setSelected}
                                                      onFilter={(filtered => {
                                                          let filteredSeriesUID = filtered.map(row => row.values.raw.SeriesInstanceUID)
                                                          addSeriesFiltered(filteredSeriesUID)
                                                      })} pagination/>
            </Row>
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        results: state.AutoRetrieveResultList.results,
        resultsSeries: state.AutoRetrieveResultList.resultsSeries
    }
}

const mapDispatchToProps = {
    emptyResultsTable,
    addSeriesDetails,
    removeSeriesResult,
    addSeriesFiltered
}

export default connect(mapStateToProps, mapDispatchToProps)(TableResultsStudiesSeries);