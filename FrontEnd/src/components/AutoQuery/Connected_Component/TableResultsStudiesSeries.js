import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux'
import {toast} from 'react-toastify'

import {addSeriesDetails, addSeriesFiltered, emptyResultsTable, removeSeriesResult} from '../../../actions/TableResult'
import apis from '../../../services/apis';
import {
    columnSeriesFactory,
    columnStudyFactory
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

    useEffect(async () => {
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
            let i = 0
            //Load All series details of studies answers
            for (let studyResults of emptyResultArray) {
                i++
                try {
                    await getSeriesDetails(studyResults.StudyInstanceUID, studyResults.OriginAET)
                    toast.update(id, {
                        render: 'Queried series ' + i + '/' + (emptyResultArray.length)
                    });
                } catch (error) {
                    console.error(error)
                }

            }
        }
    }, [])

    const columns = useMemo(() => {
        let c = [
            ...columnStudyFactory(true, true, false, false, false, null, null),
            ...columnSeriesFactory(true, true, null, null),
            {
                accessor: 'NumberOfSeriesRelatedInstances',
                Header: 'Instances'
            },
            {
                accessor: 'OriginalAET',
                Header: 'AET'
            }
        ];

        let accessors = [];
        let withoutDuplicate = [];

        c.forEach(column => {
            if (!!column.accessor && !accessors.includes(column.accessor)) {
                withoutDuplicate.push(column);
                accessors.push(column.accessor);
            }
        })

        return withoutDuplicate;
    });

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
            <input type="button" className="btn btn-warning m-2" value="Delete Selected" onClick={() => {
                removeSeriesResult(selected)
            }}/>
            <input type="button" className="btn btn-danger m-2" value="Empty Table" onClick={emptyResultsTable}/>
            <div className="mt-5">
                <CommonSelectingSortingFilteringTable tableData={data} columns={columns} onSelect={setSelected}
                                                      onFilter={(filtered => {
                                                          let filteredSeriesUID = filtered.map(row => row.values.SeriesInstanceUID)
                                                          addSeriesFiltered(filteredSeriesUID)
                                                      })}/>
            </div>
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