import React, { useMemo } from "react";
import { commonColumns, patientColumns, studyColumns } from "./ColomnFactories";
import CommonTableV8 from "./CommonTableV8";
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
        ...(withPatientColums ? [patientColumns.PARENT_NAME] : []),
        ...(withPatientColums ? [patientColumns.PARENT_ID] : []),
        studyColumns.ORTHANC_ID,
        studyColumns.STUDY_INSTANCE_UID,
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        studyColumns.ACCESSION_NUMBER,
    ]

    const columnsStudies = columns.concat(additionalColumnsStudies)

    const renderSubComponent = ({row}) => {
        let rowId = row.id
        const seriesObject = series.filter(serie => serie.StudyOrthancID === rowId)
        return <TableSeries series={seriesObject} additionalColumns={additionalColumnsSeries} />
    }


    return <CommonTableV8 id={studyColumns.ORTHANC_ID.id} canExpand columns={columnsStudies} data={studies} renderSubComponent={renderSubComponent} />
}