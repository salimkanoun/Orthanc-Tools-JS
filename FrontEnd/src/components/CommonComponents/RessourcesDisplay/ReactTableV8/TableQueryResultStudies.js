import React from "react";

import CommonTableV8 from "./CommonTableV8";
import { studyQueryColumns } from "./ColomnFactories";

export default ({ studies, canExpand = false, renderSubComponent = undefined, onRowClick = undefined, additionalColumns = [] }) => {

    const columns = [
        studyQueryColumns.PATIENT_NAME,
        studyQueryColumns.PATIENT_ID,
        studyQueryColumns.ACCESSION_NUMBER,
        studyQueryColumns.STUDY_INSTANCE_UID,
        studyQueryColumns.STUDY_DATE,
        studyQueryColumns.STUDY_DESCRIPTION,
        studyQueryColumns.REQUESTED_PROCEDURE,
        studyQueryColumns.NB_STUDY_SERIES,
        studyQueryColumns.NB_SERIES_INSTANCES,
        studyQueryColumns.MODALITY,
        studyQueryColumns.AET
    ]

    return (
        <CommonTableV8 onRowClick={onRowClick} renderSubComponent={renderSubComponent} canExpand={canExpand} id={studyQueryColumns.STUDY_INSTANCE_UID.accessorKey} columns={[...columns, ...additionalColumns]} data={studies} canSort />
    )
}