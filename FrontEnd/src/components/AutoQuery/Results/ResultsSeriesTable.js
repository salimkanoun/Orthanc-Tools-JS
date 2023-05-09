import React from 'react'
import CommonTableV8 from '../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8'
import { seriesQueryColumns, studyQueryColumns } from '../../CommonComponents/RessourcesDisplay/ReactTableV8/ColomnFactories'

export default ({ data, selectedRowIds, onSelectRow }) => {

    const columns = [
        studyQueryColumns.PATIENT_NAME,
        studyQueryColumns.PATIENT_ID,
        studyQueryColumns.ACCESSION_NUMBER,
        studyQueryColumns.STUDY_DATE,
        studyQueryColumns.STUDY_DESCRIPTION,
        studyQueryColumns.REQUESTED_PROCEDURE,
        seriesQueryColumns.SERIES_INSTANCE_UID,
        seriesQueryColumns.SERIES_DESCRIPTION,
        seriesQueryColumns.MODALITY,
        seriesQueryColumns.NB_SERIES_INSTANCES,
        seriesQueryColumns.AET
    ]

    return (
        <CommonTableV8 id={seriesQueryColumns.SERIES_INSTANCE_UID.accessorKey} canSort canSelect data={data} columns={columns} paginated canFilter onSelectRow={onSelectRow} selectedRowsIds={selectedRowIds}/>
    )
}