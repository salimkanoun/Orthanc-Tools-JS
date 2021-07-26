import React, {useMemo} from 'react';
import {connect} from 'react-redux'
import RetrieveButton from '../Components/RetrieveButton';
import {
    columnSeriesFactory,
    columnStudyFactory
} from "../../CommonComponents/RessourcesDisplay/ReactTable/ColumnFactories";
import NestedTable from "../../CommonComponents/RessourcesDisplay/ReactTable/NestedTable";
import apis from "../../../services/apis";
import {addManualQuerySeriesDetails} from "../../../actions/ManualQuery";


function TableResult({results, style, addManualQuerySeriesDetails}) {
    style = style || {};
    const columns = useMemo(() => [
        ...columnStudyFactory(true, true, true, false, false, null, null, false, true, undefined, true),
        {
            accessor: 'NumberOfStudyRelatedSeries',
            Header: 'Series'
        }, {
            accessor: 'NumberOfSeriesRelatedInstances',
            Header: 'Instances'
        }, {
            accessor: 'OriginAET',
            show: false
        }, {
            id: 'Retrieve',
            Header: 'Retrieve',
            Cell: ({row}) => {
                return (<RetrieveButton queryAet={row.values.OriginAET} studyInstanceUID={row.values.StudyInstanceUID}
                                        level={RetrieveButton.Study}/>)
            }
        }, {
            accessor: 'seriesDetails',
            lazy: true,
            table: [
                ...columnSeriesFactory(true, true, null, null),
                {
                    accessor: 'NumberOfSeriesRelatedInstances',
                    Header: 'Instances'
                }, {
                    accessor: 'OriginAET',
                    show: false
                }, {
                    id: 'Retrieve',
                    Header: 'Retrieve',
                    Cell: ({row}) => {
                        return (<RetrieveButton queryAet={row.values.raw.OriginAET}
                                                studyInstanceUID={row.values.raw.StudyInstanceUID}
                                                seriesInstanceUID={row.values.raw.SeriesInstanceUID}
                                                level={RetrieveButton.Series}/>)
                    }
                }
            ]
        }
    ], [])
    const data = useMemo(() => results.map(result => {
        let res = {...result, raw: result}

        let queryData = {
            Level: 'Series',
            Query: {
                Modality: '',
                ProtocolName: '',
                SeriesDescription: '',
                SeriesInstanceUID: '',
                StudyInstanceUID: result.StudyInstanceUID,
                SeriesNumber: '',
                NumberOfSeriesRelatedInstances: ''
            }
        }


        const seriesDetails = [...result.seriesDetails];
        if (seriesDetails.length !== 0) {
            res.seriesDetails = () => {
                return seriesDetails.map(serie => ({
                    ...serie,
                    raw: serie
                }))
            }
        } else {
            res.seriesDetails = () => {
                return apis.query.dicomQuery(result.OriginAET, queryData)
                    .then(queryAnswers => apis.query.retrieveAnswer(queryAnswers.ID))
                    .then(seriesAnswers => {
                        addManualQuerySeriesDetails(seriesAnswers, result.StudyInstanceUID);
                        return seriesAnswers;
                    })
                    .then(series => series.map(serie => ({
                        ...serie,
                        raw: serie
                    })))
            }
        }
        return res;
    }), [results]);

    return (
        <React.Fragment>
            <div style={style}>
                <div className="mt-5">
                    <NestedTable columns={columns} data={data} filtered sorted hiddenSelect/>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        results: state.ManualQuery.manualQueryResults
    }
}

const mapDispatchToProps = {
    addManualQuerySeriesDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(TableResult);