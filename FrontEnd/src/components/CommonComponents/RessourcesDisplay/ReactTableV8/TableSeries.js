import React from "react";
import { seriesColumns } from "./ColomnFactories";
import CommonTableV8 from "./CommonTableV8";

export default ({
    series, 
    additionalColumns = []
}) => {

    const columns = [
        seriesColumns.ORTHANC_ID, 
        seriesColumns.DESCRIPTION,
        seriesColumns.MODALITY,
        seriesColumns.SERIES_NUMBER,
    ]

    return (
        <CommonTableV8 id={"SeriesOrthancID"} data={series} canSelect selectedIds={[]} onSelectRow={(data) => console.log(data)} columns={columns.concat(additionalColumns)}/>
    )
}