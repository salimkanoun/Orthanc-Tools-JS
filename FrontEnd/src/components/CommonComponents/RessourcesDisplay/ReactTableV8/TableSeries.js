import React from "react";
import { seriesColumns } from "./ColomnFactories";
import CommonTableV8 from "./CommonTableV8";

export default ({
    series,
    additionalColumns = [],
    selectedIds = undefined,
    onSelectRow = undefined,
    selectable = false
}) => {

    const columns = [
        seriesColumns.ORTHANC_ID,
        seriesColumns.DESCRIPTION,
        seriesColumns.MODALITY,
        seriesColumns.SERIES_NUMBER,
        seriesColumns.NUMBER_OF_INSTANCES
    ]

    return (
        <CommonTableV8
            id={"SeriesOrthancID"}
            data={series}
            canSelect={selectable}
            selectedIds={selectedIds}
            onSelectRow={onSelectRow}
            columns={columns.concat(additionalColumns)}
        />
    )
}