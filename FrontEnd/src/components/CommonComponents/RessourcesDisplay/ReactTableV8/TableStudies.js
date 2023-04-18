import React from "react";
import { patientColumns, studyColumns } from "./ColomnFactories";
import CommonTableV8 from "./CommonTableV8";

export default ({
    studies,
    additionalColumns = [],
    rowStyle,
    onRowClick,
    withPatientColums = false,
    canSelect = false,
    onSelectRow = undefined,
    selectedRowsIds = undefined
}) => {

    const columns = [
        studyColumns.ORTHANC_ID,
        ...(withPatientColums ? [patientColumns.PARENT_NAME] : []),
        ...(withPatientColums ? [patientColumns.PARENT_ID] : []),
        studyColumns.STUDY_INSTANCE_UID,
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        studyColumns.ACCESSION_NUMBER
    ]

    return (
        <CommonTableV8 id="StudyOrthancID" selectedRowsIds={selectedRowsIds} data={studies} columns={columns.concat(additionalColumns)} rowStyle={rowStyle} onRowClick={onRowClick} canSelect={canSelect} onSelectRow={onSelectRow} />
    )
}