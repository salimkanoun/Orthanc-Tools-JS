import React from "react";
import { patientColumns, studyColumns } from "./ColomnFactories";
import CommonTableV8 from "./CommonTableV8";

export default ({
    studies,
    additionalColumns = [],
    rowStyle,
    onRowClick,
    withPatientColums = false,
    selectable = false,
    onSelect = undefined
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
        <CommonTableV8 id="StudyOrthancID" data={studies} columns={columns.concat(additionalColumns)} rowStyle={rowStyle} onRowClick={onRowClick} canSelect={selectable} onSelectRow={onSelect} />
    )
}