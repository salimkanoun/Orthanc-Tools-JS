import React from "react";

import CommonTableV8 from "./../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";
import { studyQueryColumns } from "./../../CommonComponents/RessourcesDisplay/ReactTableV8/ColomnFactories";

export default ({ studies, onSelectRow, selectedRowIds }) => {

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
        <CommonTableV8
            id={studyQueryColumns.STUDY_INSTANCE_UID.accessorKey}
            columns={columns}
            data={studies}
            onSelectRow={onSelectRow}
            selectedRowsIds={selectedRowIds}
            canSelect
            canSort
            canFilter
            paginated />
    )
}