import React from "react"

import CommonTableV8 from "./CommonTableV8"
import { seriesQueryColumns } from "./ColomnFactories"

export default ({ series, additionalColumns }) => {

    const columns = [
        seriesQueryColumns.SERIES_INSTANCE_UID,
        seriesQueryColumns.SERIES_DESCRIPTION,
        seriesQueryColumns.MODALITY,
        seriesQueryColumns.SERIES_NUMBER,
        seriesQueryColumns.NB_SERIES_INSTANCES,
    ]

    return (
        <CommonTableV8 columns={[...columns, ...additionalColumns]} data={series} canSort />
    )
}