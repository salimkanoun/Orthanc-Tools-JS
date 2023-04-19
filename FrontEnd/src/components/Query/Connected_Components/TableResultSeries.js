import React, { useMemo } from "react";

import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";
import { commonColumns, seriesColumns } from "../../CommonComponents/RessourcesDisplay/ReactTable/ColumnFactories";

export default ({
    series,
    rowEvents,
    rowStyle,
    pagination
}) => {

    const columns = useMemo(() => [
        commonColumns.RAW,
        seriesColumns.ORTHANC_ID,
        seriesColumns.DESCRIPTION,
        seriesColumns.MODALITY,
        seriesColumns.SERIES_NUMBER,
        seriesColumns.NB_SERIES_INSTANCES,
        seriesColumns.RETRIEVE,
    ], []);

    const data = useMemo(() => series.map(x => ({
        raw: { ...x },
        ...x
    })), [series]);

    return <CommonTable columns={columns} data={data} rowEvents={rowEvents}
        rowStyle={rowStyle} pagination={pagination} />
}


