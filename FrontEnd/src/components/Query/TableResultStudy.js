import React, { useCallback, useMemo, useState } from 'react';
import {
    commonColumns,
    patientColumns,
    seriesColumns,
    studyColumns
} from "../CommonComponents/RessourcesDisplay/ReactTable/ColumnFactories";
import NestedTable from "../CommonComponents/RessourcesDisplay/ReactTable/NestedTable";
import apis from "../../services/apis";
import TableResultSeries from './TableResultSeries';

export default ({ studiesData, style = {} }) => {

    const [series, setSeries] = useState({})
    
    const columns = useMemo(() => [
        commonColumns.RAW,
        studyColumns.ORTHANC_ID,
        studyColumns.STUDY_INSTANCE_UID,
        patientColumns.PARENT_NAME(),
        patientColumns.PARENT_ID(),
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        studyColumns.REQUESTED_PROCEDURE,
        studyColumns.NB_STUDY_SERIES,
        seriesColumns.NB_SERIES_INSTANCES,
        commonColumns.AET,
        studyColumns.RETRIEVE
    ], [])


    const fetchSeriesDetails = async (StudyInstanceUID, AET) => {

        let queryData = {
            Level: 'Series',
            Query: {
                Modality: '',
                ProtocolName: '',
                SeriesDescription: '',
                SeriesInstanceUID: '',
                StudyInstanceUID: StudyInstanceUID,
                SeriesNumber: '',
                NumberOfSeriesRelatedInstances: ''
            }
        }

        let seriesAnswer = await apis.query.dicomQuery(AET, queryData)
            .then(queryAnswers => apis.query.retrieveAnswer(queryAnswers.ID))
        return seriesAnswer
    }

    let onExpandedRow = (studyInstanceUID, row) => {
        fetchSeriesDetails(studyInstanceUID, row.OriginAET).then(newSeries => {
            setSeries(previousState => ({...previousState, 
                                [studyInstanceUID] : newSeries})
            )
        })
    }

    const getExpandedRow = useCallback((rowId) => {
        let studyInstanceUID = rowId
        let filteredSeries = series[studyInstanceUID] ?? []
        return < TableResultSeries series={filteredSeries} />

    }, [Object.keys(series).length])

    return (
        <React.Fragment>
            <div style={style}>
                <div className="mt-5 h-5">
                    <NestedTable getRowId={(originalRow) => originalRow.StudyInstanceUID} onExpandedRow={onExpandedRow} columns={columns} getExpandedRow={getExpandedRow} data={studiesData} filtered sorted />
                </div>
            </div>
        </React.Fragment>
    )
}