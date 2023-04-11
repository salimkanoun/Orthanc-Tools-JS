import React, { useMemo } from "react";
import { commonColumns, patientColumns, studyColumns } from "./ColomnFactories";
import NestedTableV8 from "./NestedTableV8";
import TableSeries from "./TableSeries";

export default ({
    studies,
    series,
    withPatientColums, 
    additionalColumnsStudies = [],
    additionalColumnsSeries  = []
}) => {

    const columns = [
        commonColumns.RAW,
        ...(withPatientColums ? [patientColumns.PARENT_NAME] : []),
        ...(withPatientColums ? [patientColumns.PARENT_ID] : []),
        studyColumns.ORTHANC_ID,
        studyColumns.STUDY_INSTANCE_UID,
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        studyColumns.ACCESSION_NUMBER,
    ]

    const columnsStudies = columns.concat(additionalColumnsStudies)

    const renderSubComponent = (row) => {
        const seriesObject = series.filter(serie => serie.StudyOrthancID === row.StudyOrthancID)
        return <TableSeries series={seriesObject} additionalColumns={additionalColumnsSeries} />
    }


    return <NestedTableV8 columnsTable={columnsStudies} data={studies} renderSubComponent={() => renderSubComponent} />
}